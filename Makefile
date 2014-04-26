all:
	tsc --outDir scripts --noImplicitAny `find src -name *.ts`
	rsync -a --exclude "*~" --exclude ".*.sw?" --exclude "*.ts" src/ scripts/

clean:
	-rm scripts *.*
	find . -name *~ | xargs rm -f
