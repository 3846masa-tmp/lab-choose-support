$(function(){
var href = location.href;
if (href.indexOf("questionAnswer") < 0) {
  return;
}

var changeButton = $("<button>").addClass("btn bSizeS fSizeSS");
changeButton.bind('click',initUI).attr({type: 'button', id: 'changeUI'});
changeButton.css({display: 'inline-block', margin: '0 10px'});
$("h2.questionnaire").append(
  changeButton.append($('<span>').text("UI変更"))
);

function initUI() {
  $(this).attr({disabled: true}).css({opacity: 0.5});

  var table = $('.questionnaireDetail:has(table) table');
  $('tr.heading th', table).each(function(){$(this).text($(this).text().replace(/究室/,''));});
  $('tr.heading .questionSub', table).css({ 'min-width': '40px' });

  var randomButton = $("<button>").addClass("btn bSizeS fSizeSS");
  randomButton.bind('click',randomSet).attr({type: 'button', id: 'randamize'});
  randomButton.css({display: 'inline-block', margin: '0 10px'});
  $("tr.heading th:eq(0)", table).append(
    randomButton.append($('<span>').text("ランダム"))
  );

  var labs = $.grep(
    $('tr.heading th', table).map(function(){return $(this).text().trim();}),
    function(name){return name.length;}
  );

  var selectList = $('<select>').css({width: '50px'});
  for (var i = 0; i < labs.length; i++) {
    selectList.append($('<option>').text(i+1).val(i));
  }

  var selectListBoxesLine = $('tr:not(.heading):first', table).clone();
  selectListBoxesLine.find('th').text('希望順');

  var selectListBoxes = selectListBoxesLine.find('td');
  selectListBoxes.each(function(){
    var listBox = selectList.clone().attr({lab: selectListBoxes.index(this)});
    listBox.bind('change', setValue);
    $(this).empty().append(listBox);
  });

  $('tr:not(.heading)', table).hide();
  $('tr.heading', table).after(selectListBoxesLine);
  $('#questionForm > div.btnField p').text('このページは拡張機能で生成されています．次の確認ページで必ず確認してください．');

  initValue();
  setValue();

  function initValue() {
    $('[id*="subQuestionDetails"]', table).each(function(){
      if (this.checked) {
        var info = $(this).attr('id').match(/subQuestionDetails\[(\d+)\]\_answer(\d+)/);
        if (info.length === 3) {
          $('select[lab=' + info[2] + ']').val(info[1]);
        }
      }
    });
  }

  function setValue() {
    $('[id*="subQuestionDetails"]', table).each(function(){this.checked = false;});
    $('select', table).each(function(){
      var labNum = $(this).attr('lab');
      var rankNum = $(this).val();
      var selectID = "subQuestionDetails[" + rankNum + "]_answer" + labNum;
      $("[id$='" + selectID + "']")[0].checked = true;
    });

    checkUnique();
  }

  function randomSet() {
    var valuesList = [];
    for (var n = 0; n < $('select', table).length; n++) valuesList.push(n);
    valuesList.sort(function () { return (Math.random() < 0.5) ? -1 : 1; });
    $('select', table).each(function () {
      $(this).val(valuesList.shift());
    });
    checkUnique();
  }

  function checkUnique() {
    var valuesList = $('select', table).map(function(){return this.value;});
    var notUniques = $.makeArray(valuesList).filter(function (x, i, self) {
      return self.indexOf(x) === i && i !== self.lastIndexOf(x);
    });

    $('select', table).each(function(){
      if (notUniques.indexOf(this.value) >= 0)
        $(this).css({color: "#FAFAFA", background: "#B71C1C"});
      else
        $(this).css({color: "#212121", background: "#BDBDBD"});
    });
    $('option', table).each(function(){
      if ($.makeArray(valuesList).indexOf($(this).attr('value')) >= 0)
        $(this).css({color: "#FAFAFA", background: "#B71C1C"});
      else
        $(this).css({color: "#212121", background: "#BDBDBD"});
    });
  }
}

});
