MarbleSmash = {};

MarbleSmash.Boot = function (game) {

};

MarbleSmash.Boot.prototype = {

    init: function () {


        game.stage.disableVisibilityChange = false;
        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        game.stage.backgroundColor = 0xFFFFFF;
        game.time.advancedTiming = true;

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        //screen size will be set automatically
        this.scale.setScreenSize(true);



        game.scaleGameSizeUpdate = function() {

            var ratio = window.innerHeight/window.innerWidth;
            var state = game.state.getCurrentState();

            if (420*ratio>525) {
                game.scale.setGameSize(420,Math.min(800,Math.floor(420*ratio)));    
            }else {
                game.scale.setGameSize(420,525);
            }

            if (typeof(state.resize) !== 'undefined') {
                state.resize();  
            } 

        }

        //game.scale.setResizeCallback(game.scaleGameSizeUpdate,game);
        this.game.scale.onSizeChange.add(game.scaleGameSizeUpdate);
        
    },

    preload: function () {

        game.load.text('json-settings', 'settings.json');
        game.load.image('loader_cmlogo','cmlogo.png');
        game.load.image('loader_loadingbar_bg','loadingbar_bg.png');
        game.load.image('loader_loadingbar','loadingbar.png');
        game.load.image('loader_1','1.png');
        game.load.image('loader_2','2.png');
        game.load.image('loader_3','3.png');
        game.load.image('loader_4','4.png');
        game.load.image('loader_5','5.png');
        game.load.image('loader_bg','bg.jpg');
    },

    create: function () {

        game.jsonSettings = JSON.parse(game.cache.getText('json-settings'));

        game.puzzle_category = 0;
        this.state.start('Preloader');

    }

};



SaveState = {}

SaveState.loadData = function() {

    this.data = null;


    try {
        this.data = localStorage.getItem('marbleSmash_saveState');
    }
    catch (e) {

    }

    if (this.data != null) {
        this.data = JSON.parse(window.atob(this.data));
    }else {
        this.createNew();
    }

}

SaveState.createNew = function() {

    this.data = {
        coins: 100,
        highscore: 0,
        puzzle: [[],[],[],[]],
        puzzles_unlocked: [1,1,1,1],
        sound_mute: false,
        tutorial_puzzle: true,
        tutorial_timeAttack: true
    }

    this.data.puzzle.forEach(function(child) {
        for(var i = 0; i < 100; i++) {
            child[i] = false;
        }
    })
}

SaveState.passLevel = function() {
    if (this.data.puzzle[game.puzzle_category][game.puzzle_nr] == 0) {
        this.data.puzzles_unlocked[game.puzzle_category]++;
        this.data.puzzle[game.puzzle_category][game.puzzle_nr] = 1;
        this.save();

        return true;
    }

    return false;
}

SaveState.save = function() {
    try {
        localStorage.setItem('marbleSmash_saveState',window.btoa(JSON.stringify(this.data)));
    }catch (e) {

    }
}

SaveState.checkIfHighscore = function(points) {
    if (this.data.highscore < points) {
        this.data.highscore = points;
        this.save();
        return true;
    }
    return false;
}

SaveState.loadData();