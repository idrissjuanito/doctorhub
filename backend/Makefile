CONFIG_FILE=./.env
VENVPATH=.venv
PYTHON=$(VENVPATH)/bin/python3
UVICORN=$(VENVPATH)/bin/uvicorn

##venv: setUp the virtualenv (this step is integrated with the instal-xxx target
venv: $(VENVPATH)/bin/activate
$(VENVPATH)/bin/activate: requirements.txt
	test -d $(VENVPATH) || python3 -m venv $(VENVPATH); \
	. $(VENVPATH)/bin/activate; \
	pip install -U pip; \
	pip install -r requirements.txt; \
	touch $(VENVPATH)/bin/activate;

$(CONFIG_FILE):
	echo "> Adding config file..."
	cp .env.example $(CONFIG_FILE)

##install-deps: setup your prod environment
install-deps: venv $(CONFIG_FILE)

##install-dev-deps: setup your dev environment
install-dev-deps: install-deps $(CONFIG_FILE)
	$(PYTHON) -m pip install -r requirements-dev.txt

##run: run the api locally
run: install-deps
	$(UVICORN) onacut.main:app --reload


##clean: clean the virtualenv
clean:
	rm -rf $(VENVPATH)

##help: show help
help : Makefile
	@sed -n 's/^##//p' $<

.PHONY : help venv install-dev-deps install-deps test lint docker-run docker-build run clean
