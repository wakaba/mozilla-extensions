REPPL_DIR = ../../../../../../tool/
REPPL_SRC = ../../../../package-info.src
REPPL_SCRIPT = $(REPPL_DIR)replace.pl
REPPL = perl $(REPPL_SCRIPT) $(REPPL_SRC)

GENERATED_FILES = contents.rdf add-panel.dtd pref-panel.properties

all: $(GENERATED_FILES)

%.xml: %.xml.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=xml --input=$< > $@
%.rdf: %.rdf.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=xml --input=$< > $@
%.dtd: %.dtd.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=xml --input=$< > $@
%.properties: %.properties.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=moz-properties --input=$< > $@

clean:
	-rm -v $(GENERATED_FILES)
