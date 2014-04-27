all:
	tsc --outDir scripts/lobe-lib --noImplicitAny `find src -name *.ts`
	rsync -a --exclude "*~" --exclude ".*.sw?" --exclude "*.ts" src/ scripts/

clean:
	-rm scripts/lobe-lib/*.*
	find . -name *~ | xargs rm -f
