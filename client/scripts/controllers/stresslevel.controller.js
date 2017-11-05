import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Stresslevels, Questions } from '../../../lib/collections';
 
export default class StressLevelCtrl extends Controller {
  constructor() {
    super(...arguments);
    this.helpers({
      data() {
        return Stresslevels.find();
      },
      stress(){
        
      },
      questions(){   
        const questions= Questions.find({},{skip: Math.random()  * Questions.find().count()});
        return questions;
      }
    });
  }

  submitAnswer(value, text, binary, id, type){
    //this.callMethod('submitAnswer', value, text, id);

    if (type == 0){
      this.callMethod('newStressAnswer', {
        questionId: id,
        answer: text,
        value: value
      });
    }else{
      if (binary == undefined){
        binary = false
      }
      this.callMethod('newStressAnswer', {
        questionId: id,
        answer: text,
        check: binary
      });
    }

    this.$state.go('tab.tasks');   
  }
}
 
StressLevelCtrl.$name = 'StressLevelCtrl';
StressLevelCtrl.$inject = ['$stateParams', '$timeout', '$log', '$state'];
