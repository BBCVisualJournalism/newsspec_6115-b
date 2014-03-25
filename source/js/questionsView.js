define(['lib/news_special/bootstrap'], function (news) {

    var questionPicHolder = news.$('.question_pic_holder');

    var QuestionView = function (quiz) {
        var questionView = this;
        this.model = quiz;
        news.pubsub.on('updateQuestion', function () {
            questionView.updateQuestion();
        });
        news.pubsub.on('submitResponse', function () {
            questionComplete(questionView.model);
        });
        news.pubsub.on('loadResult', function () {
            questionView.renderResult();
        });
        news.pubsub.on('resetQuizView', function () {
            news.$('.result').removeClass('show');
            news.$('.result--text').html('');
            news.$('.share_tools_holder').addClass('hide');
            news.$('.question').removeClass('hide');
            questionView.updateQuestion();
        });
    };

    function displayQuestion(model) {
        hideResetButton();
        hideFactbox();
        hideNextButton();
        renderQuestionText(model);
        if (questionPicHolder) {
            questionPicHolder.attr('class', 'question_pic_holder');
            questionPicHolder.addClass('open_' + model.getCurrentQuestion());
        }
    }

    function renderQuestionText(model) {
        var question = model.data.questions[model.getCurrentQuestion()],
            options = question.main.options,
            values = question.main.values,
            optionsLength = options.length,
            optionIndex = 0,
            optionsHtml = '',
            labelHTML = '',
            inputHTML = '',
            idName = '',
            optionValue;

        for (optionIndex; optionsLength > optionIndex; optionIndex++) {
            optionValue = values[optionIndex];
            idName = 'option' + optionIndex;
            labelHTML = '<label for="' + idName + '" class="btn">' + options[optionIndex] + '</label>';
            inputHTML = '<input type="radio" name="candidate_options" id="' + idName + '" value="' + optionValue + '" />';
            optionsHtml += '<li class="option">' + inputHTML + labelHTML + '</li>';
        }
        news.$('.question--text').removeClass('hide');
        news.$('.question--fact').html(question.fact);
        news.$('.question--text').html(question.main.text);
        news.$('.options').html(optionsHtml);
    }

    function getResult(score, resultArr) {
        for (var i = 0; i < resultArr.length; i++) {
            if (score <= resultArr[i].maxScore) {
                return resultArr[i];
            }
        }
        return false;
    }

    function renderResultView(model) {
        news.$('.question').addClass('hide');
        news.$('.result').addClass('show');
        news.$('.share_tools_holder').removeClass('hide');
        var result = getResult(model.getScore(), model.data.results);

        if (
            typeof result.summary === 'undefined' ||
            result.summary        === 0           ||
            result.summary        === null        ||
            result.summary        === ''
        ) {
            result.summary = 'Unknown error';
        }
        if (
            typeof result.description === 'undefined' ||
            result.description        === 0           ||
            result.description        === null        ||
            result.description        ===             ''
        ) {
            result.description = 'There was a problem getting your result.';
        }

        news.$('.result--heading').html('You scored ' + model.getScore() + ' out of 32');
        news.$('.result--summary').html(result.summary);
        news.$('.result--text').html(result.description + model.data.generalAdvice);
        displayResetButton();
        news.pubsub.emit('newsspec_6115:message', ['I scored ' + model.getScore() + ' out of 32 on the BBC Stress Quiz.']);
    }

    function questionComplete(model) {
        displayFactbox();
        if (questionPicHolder) {
            questionPicHolder.removeClass('close_' + model.getCurrentQuestion());
        }
    }

    function displayFactbox() {
        news.$('.question--fact').removeClass('hide');
        displayNextButton();
    }

    function hideFactbox() {
        news.$('.question--fact').addClass('hide');
    }

    function displayNextButton() {
        news.$('.button--next_question').removeClass('hide');
    }

    function hideNextButton() {
        news.$('.button--next_question').addClass('hide');
    }

    function displayResetButton() {
        news.$('.button--reset_quiz').removeClass('hide');
    }

    function hideResetButton() {
        news.$('.button--reset_quiz').addClass('hide');
    }

    QuestionView.prototype.updateQuestion = function () {
        displayQuestion(this.model);
    };

    QuestionView.prototype.renderResult = function () {
        renderResultView(this.model);
    };

    return QuestionView;

});