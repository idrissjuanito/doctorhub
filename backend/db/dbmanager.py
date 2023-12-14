from abc import ABC
from functools import reduce
from flask_restful import abort
from db import DBConnect


class DBManager(ABC):
    __existing_tables = []
    _tablename = None
    __queries = []
    __fetch_queries = []

    @classmethod
    def get_attr(cls):
        cls_dict = cls.__dict__.items()
        new = {k: v for k, v in cls_dict if not k.startswith("_")}
        return new

    @classmethod
    def insert_record(cls, data: object):
        fields = ""
        holders = ""
        records = data.__dict__
        for k in list(records.keys()):
            if records[k] is None:
                del records[k]
                continue
            fields += f", {k}" if fields != "" else f"{k}"
            holders += ", %s" if holders != "" else "%s"
        sql = f"INSERT INTO {cls._tablename} ({fields}) values ({holders})"
        query = (sql, tuple(records.values()))
        cls.__queries.append(query)
        if cls.__name__ not in cls.__existing_tables:
            cls.create_table()
        return cls

    @classmethod
    def save(cls):
        session = DBConnect()
        cursor = session.get_cursor()
        try:
            for query in DBManager.__queries:
                print(query)
                cursor.execute(query[0], query[1])
            session.commit()
            DBManager.__queries.clear()
        except Exception as e:
            abort(500, message=e)

    @classmethod
    def find(cls, fields="*", filters=None, filter_values=None, order=None):
        tbl = cls._tablename
        base = f"SELECT {fields} FROM {tbl}"
        DBManager.__fetch_queries.clear()
        DBManager.__fetch_queries.append(base)
        if filter_values and filters is None:
            filters = f'{tbl}_id'
        if filters is not None:
            filters_string = DBManager.parse_filters(filters)
            DBManager.__fetch_queries.append(filters_string)
        if order is not None:
            DBManager.__fetch_queries.append(f" ORDER BY {order}")
        DBManager.__fetch_queries.append(filter_values)
        return cls

    @staticmethod
    def parse_filters(filters):
        filter_string = ' WHERE '
        if type(filters) is not list:
            filter_string += f'{filters} = %s'
            return filter_string
        for flt in filters:
            if filter_string[-1] != ' ':
                filter_string += ' '
            if type(flt) is str:
                filter_string += f'{flt} = %s'
            else:
                filter_string += ' '.join(f'{flt} %s')
        return filter_string

    @classmethod
    def fetch(cls, limit=""):
        sql = "".join(DBManager.__fetch_queries[:-1])
        prepared_values = DBManager.__fetch_queries[-1]
        print(prepared_values)
        session = DBConnect()
        cursor = session.get_cursor()
        print(sql)
        results = None
        try:
            if limit == "all":
                cursor.execute(sql, prepared_values)
                results = cursor.fetchall()
            elif type(limit) is int:
                sql += f" LIMIT {limit};"
                cursor.execute(sql, prepared_values)
                results = cursor.fetchmany(int(limit))
            else:
                cursor.execute(sql + " LIMIT 1", prepared_values)
                results = cursor.fetchone()
            return results
        except Exception as e:
            abort(500, message=e)

    @classmethod
    def join(cls, join, table, on=None):
        if on is None:
            on = f'{table}_id = {cls.__name__.lower()}_id'
        DBManager.__fetch_queries.insert(1, f" {join} JOIN {table} ON {on}")
        return cls

    @classmethod
    def update_records(cls, entity_id: str, columns: dict, filters=''):
        tbl = cls.__name__.lower()
        updates = reduce(lambda key, nextv: f'{key} {nextv} = %s,',
                         list(columns.keys()), '')
        sql = f'UPDATE {tbl} SET {updates[1:-1]} WHERE {tbl}_id = %s'
        param_values = tuple(columns.values()) + (entity_id,)
        DBManager.__queries.append((sql, param_values))
        return cls

    @classmethod
    def create_table(cls):
        table_fields = ""
        for key, value in cls.__dict__.items():
            if not key.startswith("_"):
                table_fields += f"{key} {value},"
        tbl = cls._tablename
        query = f"CREATE TABLE IF NOT EXISTS {tbl} ({table_fields[:-1]})"
        try:
            session = DBConnect()
            cursor = session.get_cursor()
            cursor.execute(query)
            session.commit()
            cls.__existing_tables.append(cls.__name__)
        except Exception as e:
            abort(500, message=e)


def relationship(cls, key: str):
    cls.create_table()
    key_type = cls.__dict__[key].split()[0]
    return f'{key_type} REFERENCES {cls._tablename}({key})'
