import psycopg2
from psycopg2.extras import RealDictCursor


class DBConnect:
    conn = None
    cursor = None

    def __init__(self):
        DBConnect.conn = psycopg2.connect(
                database="doctorhub",
                host="localhost",
                user="afrosilicon",
                port=5432,
                password="$Sudo#Pass001")
        DBConnect.cursor = DBConnect.conn.cursor(cursor_factory=RealDictCursor)

    @classmethod
    def close(cls):
        if cls.cursor is not None:
            print("closing")
            cls.cursor.close()
        if cls.conn is not None:
            cls.conn.close()

    def commit(self):
        self.conn.commit()

    def get_cursor(self):
        return self.cursor
