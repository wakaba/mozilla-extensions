REPPL_DIR = ../../../../../tool/
REPPL_SRC = ../../../../package-info.src
REPPL_SCRIPT = $(REPPL_DIR)replace.pl
REPPL = perl $(REPPL_SCRIPT) $(REPPL_SRC)

GENERATED_FILES = contents.rdf livehttpheaders.dtd PageInfo.dtd

all: contents.rdf livehttpheaders.dtd PageInfo.dtd

%.xml: %.xml.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=xml --input=$< > $@
%.rdf: %.rdf.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=xml --input=$< > $@
%.dtd: %.dtd.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=xml --input=$< > $@

clean:
	-rm -v $(GENERATED_FILES)
