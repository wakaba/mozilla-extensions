REPPL_DIR = ../../../../
REPPL_SRC = $(REPPL_DIR)package-info.src
REPPL_SCRIPT = $(REPPL_DIR)replace.pl
REPPL = perl $(REPPL_SCRIPT) $(REPPL_SRC)

GENERATED_FILES = contents.rdf

all: contents.rdf

%.xml: %.xml.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=xml --input=$< > $@
%.rdf: %.rdf.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=xml --input=$< > $@

clean:
	-rm -v $(GENERATED_FILES)
