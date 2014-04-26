all:
	-mkdir scripts
	tsc --outDir scripts --noImplicitAny `find src -name *.ts`
	rsync -a --exclude "*~" --exclude ".*.sw?" --exclude "*.ts" src/ scripts/

clean:
	-rm -rf scripts
	find . -name *~ | xargs rm -f
