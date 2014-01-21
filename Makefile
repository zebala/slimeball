#Makefile for building and minimizing HTML5 Soccer Slime

BUILD=build
SRC=src

SOURCES=$(SRC)/core.js $(SRC)/slimes.js $(SRC)/ball.js $(SRC)/team.js $(SRC)/stage.js $(SRC)/jumbotron.js $(SRC)/keys.js $(SRC)/updater.js $(SRC)/mode.js $(SRC)/launcher.js

all: concatenate minimize

concatenate:
	mkdir -p $(BUILD)
	cat $(SOURCES) > $(BUILD)/soccerslime.js

minimize:
	java -jar tools/compiler.jar --js=$(BUILD)/soccerslime.js --js_output_file=$(BUILD)/soccerslime.min.js

clean:
	rm -Rf $(BUILD)
