EXCLUDED_FILES = \
	*.BAK *~ */*.BAK */*~ */*/*.BAK */*/*~ */*/*/*.BAK */*/*/*~ \
	CVS/ CVS/* */CVS/ */CVS/* */*/CVS/ */*/CVS/* */*/*/CVS/ */*/*/CVS/* \
	ChangeLog Makefile .cvsignore *.src *.in replace.pl \
	*.jarsrc/ *.jarsrc/* *.jarsrc/*/ *.jarsrc/*/* *.jarsrc/*/*/ *.jarsrc/*/*/* \
	*.jarsrc/*/*/*/ *.jarsrc/*/*/*/* *.jarsrc/*/*/*/*/ *.jarsrc/*/*/*/*/* \
	*.jarsrc/*/*/*/*/*/ *.jarsrc/*/*/*/*/*/* \
	*.xpi
REPPL_DIR = ./
REPPL_SRC = $(REPPL_DIR)package-info.src
REPPL_SCRIPT = $(REPPL_DIR)replace.pl
REPPL = perl $(REPPL_SCRIPT) $(REPPL_SRC)

GENERATED_FILES = ./*.xpi ./*.jar install.js
PACKAGE_BASENAME = navlinksidebar

all: $(PACKAGE_BASENAME).xpi

dummy:

%.jar: %.jarsrc dummy
	cd $< && zip -r $@ * -x $(EXCLUDED_FILES)
	mv $</$@ $@

%.jarsrc: dummy
	cd $@/content && make all
	cd $@/locale/ja-JP/$(PACKAGE_BASENAME) && make all
	cd $@/locale/en-US/$(PACKAGE_BASENAME) && make all

%.xpi: %.jar install.js
	-rm $@
	zip -r $@ * -x $(EXCLUDED_FILES)

install.js: install.js.in $(REPPL_SRC) $(REPPL_SCRIPT)
	$(REPPL) --output-type=js --input=$< > $@

clean:
	-rm -v $(GENERATED_FILES)
	-rm -v ./*~ ./.*~ ./*.BAK ./.*.BAK
