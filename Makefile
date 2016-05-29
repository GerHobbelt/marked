all: marked.js marked.min.js

marked.js: lib/marked.js
	cp lib/marked.js marked.js

marked.min.js: lib/marked.js
	uglifyjs --comments '/\*[^\0]+?Copyright[^\0]+?\*/' -o marked.min.js lib/marked.js

clean:
	-@rm -f marked.js
	-@rm -f marked.min.js

bench:
	node test --bench

.PHONY: clean all bench
