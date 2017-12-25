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
}).controller('MainPageController', function($scope, letter, shuffleArray){
    $scope.userAnswer = '';
    $scope.startPage = true;
    $scope.showAnswer = false;
    $scope.wrongAnswer = false;
    $scope.alphabet = japaneseAlphabet;
    $scope.startLearning = function(type){
        $scope.startPage = false;
        $scope.trainingType = type;
        $scope.alphabet = shuffleArray($scope.alphabet);
        $scope.newAnswer(type=='Hiragana');
    };
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
                $scope.newAnswer(true);
            else
                $scope.newAnswer(false);
        } else {
            $scope.wrongAnswer = true;
        }
    }
    $scope.newAnswer = function(hiragana){
        if(hiragana === true)
            $scope.letter = $scope.alphabet[letter.index].hiragana;
        else
            $scope.letter = $scope.alphabet[letter.index].katakana;

        $scope.answer = $scope.alphabet[letter.index].romaji;
    }
    $scope.checkKey = function(event){
        if(event.keyCode == 13) //Enter
            $scope.checkAnswer();
        /*else if(event.keyCode == 16) //Shift
            $scope.showAnswer = !$scope.showAnswer;*/
    }
});