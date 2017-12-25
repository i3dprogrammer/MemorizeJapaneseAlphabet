angular.module('app', []);
var app = angular.module('app');

app.value('letter', {index: 0}) //xD
.factory('shuffleArray', function(){
    return function(array){
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}).controller('MainPageController', function($scope, $rootScope, letter, shuffleArray){
    $scope.startPage = true;
    
    $scope.startLearning = function(type){
        $scope.startPage = false;
        $scope.trainingType = type;
        console.log(type);
        if(!type.endsWith('omaji'))
            $scope.$broadcast('startAlphabetController', {hiragana: type=='Hiragana'});
        else{
            $scope.$broadcast('startRomajiController', {hiragana: type.startsWith('Hiragana')});
        }
    };
}).controller('alphabetController', function($scope, letter, shuffleArray){
    $scope.showAlphabetController = false;
    $scope.showAnswer = false;
    $scope.wrongAnswer = false;
    $scope.userAnswer = '';
    $scope.alphabet = shuffleArray(japaneseAlphabet.slice(0));
    $scope.checkAnswer = function(){
        if($scope.answer == $scope.userAnswer){
            $scope.wrongAnswer = false;
            $scope.showAnswer = false;
            $scope.userAnswer = '';
            if(++letter.index >= $scope.alphabet.length)
            {
                $scope.alphabet = shuffleArray($scope.alphabet);
                letter.index = 0;
            }
            if($scope.trainingType == 'Hiragana')
                $scope.newQuestion(true);
            else
                $scope.newQuestion(false);
        } else {
            $scope.wrongAnswer = true;
        }
    };
    $scope.newQuestion = function(hiragana){
        if(hiragana === true)
            $scope.letter = $scope.alphabet[letter.index].hiragana;
        else
            $scope.letter = $scope.alphabet[letter.index].katakana;

        $scope.answer = $scope.alphabet[letter.index].romaji;
    };
    $scope.checkKey = function(event){
        if(event.keyCode == 13) //Enter
            $scope.checkAnswer();
        /*else if(event.keyCode == 16) //Shift
            $scope.showAnswer = !$scope.showAnswer;*/
    };
    $scope.$on('startAlphabetController', function(event, data){
        $scope.newQuestion(data.hiragana);
        $scope.showAlphabetController = true;
    });
}).controller('romajiController', function($scope, letter, shuffleArray){
    $scope.showRomajiController = false;
    $scope.showAnswer = false;
    $scope.wrongAnswer = false;
    $scope.alphabet = shuffleArray(japaneseAlphabet.slice(0));
    $scope.newQuestion = function(hiragana){
        if(hiragana === true)
            $scope.answer = $scope.alphabet[letter.index].hiragana;
        else
            $scope.answer = $scope.alphabet[letter.index].katakana;

        $scope.letter = $scope.alphabet[letter.index].romaji;
    };
    $scope.checkAnswer = function(event){
        if($scope.answer == event.target.innerText){
            $scope.wrongAnswer = false;
            $scope.showAnswer = false;
            if(++letter.index >= $scope.alphabet.length)
            {
                $scope.alphabet = shuffleArray($scope.alphabet);
                letter.index = 0;
            }
            if($scope.trainingType.startsWith('Hiragana'))
                $scope.newQuestion(true);
            else
                $scope.newQuestion(false);
        } else {
            $scope.wrongAnswer = true;
        }
    };
    $scope.$on('startRomajiController', function(event, data){
        $scope.newQuestion(data.hiragana);
        $scope.items = japaneseAlphabet.slice(0).map(function(x){
            if($scope.trainingType.startsWith('Hiragana'))
                return x.hiragana;
            else
                return x.katakana;
        });
        $scope.showRomajiController = true;
    });
});