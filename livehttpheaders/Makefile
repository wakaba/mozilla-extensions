EXCLUDED_FILES = \
	*.BAK *~ */*.BAK */*~ */*/*.BAK */*/*~ */*/*/*.BAK */*/*/*~ \
	CVS/ CVS/* */CVS/ */CVS/* */*/CVS/ */*/CVS/* */*/*/CVS/ */*/*/CVS/* \
	ChangeLog Makefile .cvsignore *.src *.in \
	*.jarsrc/ *.jarsrc/* *.jarsrc/*/ *.jarsrc/*/* *.jarsrc/*/*/ *.jarsrc/*/*/* \
	*.jarsrc/*/*/*/ *.jarsrc/*/*/*/* *.jarsrc/*/*/*/*/ *.jarsrc/*/*/*/*/* \
	*.jarsrc/*/*/*/*/*/ *.jarsrc/*/*/*/*/*/* \
        release/ release/* \
	*.xpi
REPPL_DIR = ../tool/
REPPL_SRC = ./package-info.src
REPPL_SCRIPT = $(REPPL_DIR)replace.pl
REPPL = perl $(REPPL_SCRIPT) $(REPPL_SRC)

GENERATED_FILES = ./*.xpi ./*.jar install.js install-res.en.inf
ORIGINAL_PACKAGE_BASENAME = livehttpheaders
PACKAGE_BASENAME = $(ORIGINAL_PACKAGE_BASENAME)-ja

all: $(PACKAGE_BASENAME).xpi

dummy:

%.jar: %.jarsrc dummy
	cd $< && zip -r $@ * -x $(EXCLUDED_FILES)
	mv $</$@ $@

%.jarsrc: dummy
	cd $@/locale/ja-JP/$(ORIGINAL_PACKAGE_BASENAME) && make all

%.xpi: %.jar install.js install-res.en.inf
	-rm $@
	zip -r $@ * -x $(EXCLUDED_FILES)

install.js: $(REPPL_DIR)install.js.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=js --input=$< > $@

install-res.en.inf: $(REPPL_DIR)install-res.en.inf.in
	$(REPPL) --output-type=moz-properties --input=$< > $@

clean:
	-rm -v $(GENERATED_FILES)
	-rm -v ./*~ ./.*~ ./*.BAK ./.*.BAK
	cd $(PACKAGE_BASENAME).jarsrc/locale/ja-JP/$(ORIGINAL_PACKAGE_BASENAME) && make clean

