EXCLUDED_FILES = \
	*.BAK *~ */*.BAK */*~ */*/*.BAK */*/*~ */*/*/*.BAK */*/*/*~ \
	CVS/ CVS/* */CVS/ */CVS/* */*/CVS/ */*/CVS/* */*/*/CVS/ */*/*/CVS/* \
	CVS/.* */CVS/.* */*/CVS/.* */*/*/CVS/.* */*/*/*/CVS/.* \
	*/*/*/*/*/CVS/.* \
	ChangeLog Makefile \
	.cvsignore */.cvsignore */*/.cvsignore */*/*/.cvsignore \
	*/*/*/*/.cvsignore */*/*/*/*/.cvsignore \
	*.src *.in \
	*.jarsrc/ *.jarsrc/* *.jarsrc/*/ *.jarsrc/*/* *.jarsrc/*/*/ \
	*.jarsrc/*/*/* *.jarsrc/*/*/*/ *.jarsrc/*/*/*/* *.jarsrc/*/*/*/*/ \
	*.jarsrc/*/*/*/*/* *.jarsrc/*/*/*/*/*/ *.jarsrc/*/*/*/*/*/* \
        release/ release/* release/.* \
	*.xpi
REPPL_DIR = ../../tool/
REPPL_SRC = ./package-info.src
REPPL_SCRIPT = $(REPPL_DIR)replace.pl
REPPL = perl $(REPPL_SCRIPT) $(REPPL_SRC)

MKDIR = mkdir

GENERATED_FILES = ./*.xpi ./*.jar ./chrome/*.jar install.js install-res.en.inf \
  install.rdf update.rdf
ORIGINAL_PACKAGE_BASENAME = linktoolbar
PACKAGE_BASENAME = $(ORIGINAL_PACKAGE_BASENAME)-ja

all: update.rdf $(PACKAGE_BASENAME).xpi

dummy:

chrome:
	$(MKDIR) chrome

%.jar: %.jarsrc chrome dummy
	cd $< && zip -r $@ * -x $(EXCLUDED_FILES)
	mv $</$@ chrome/$@

%.jarsrc: dummy
	cd $@/locale/ja-JP/$(ORIGINAL_PACKAGE_BASENAME) && make all

%.xpi: %.jar install.js install-res.en.inf install.rdf
	-rm $@
	zip -r $@ * -x $(EXCLUDED_FILES)

install.js: $(REPPL_DIR)install-2004.js.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=js --input=$< > $@

install-res.en.inf: $(REPPL_DIR)install-res.en.inf.in
	$(REPPL) --output-type=moz-properties --input=$< > $@

install.rdf: install.rdf.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=xml --input=$< > $@

update.rdf: update.rdf.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=xml --input=$< > $@

clean:
	-rm -v $(GENERATED_FILES)
	-rm -v ./*~ ./.*~ ./*.BAK ./.*.BAK
	cd $(PACKAGE_BASENAME).jarsrc/locale/ja-JP/$(ORIGINAL_PACKAGE_BASENAME) && make clean

