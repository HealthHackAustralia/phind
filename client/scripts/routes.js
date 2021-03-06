import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Config, Runner } from 'angular-ecmascript/module-helpers';

import tasksTemplateUrl from '../templates/tasks.html';
import chatsTemplateUrl from '../templates/chats.html';
import chatTemplateUrl from '../templates/chat.html';
import confirmationTemplateUrl from '../templates/confirmation.html';
import settingsTemplateUrl from '../templates/settings.html';
import loginTemplateUrl from '../templates/login.html';
import profileTemplateUrl from '../templates/profile.html';
import tabsTemplateUrl from '../templates/tabs.html';
import diaryTemplateUrl from '../templates/diary.html';
import stressLevelTemplateUrl from '../templates/stresslevel';
import taskTemplateUrl from '../templates/task';
import resourceTemplateUrl from '../templates/resources.html';
 
class RoutesConfig extends Config {
  constructor() {
    super(...arguments);
 
    this.isAuthorized = ['$auth', this.isAuthorized.bind(this)];
  }
  configure() {
    this.$stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: tabsTemplateUrl,
      })
      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: chatsTemplateUrl,
            controller: 'ChatsCtrl as chats'
          }
        }
      })
      
		.state('tab.chat', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: chatTemplateUrl,
            controller: 'ChatCtrl as chat'
          }
        }
    })
    .state('login', {
        url: '/login',
        templateUrl: loginTemplateUrl,
        controller: 'LoginCtrl as logger'
    })
    .state('confirmation', {
        url: '/confirmation/:phone',
        templateUrl: confirmationTemplateUrl,
        controller: 'ConfirmationCtrl as confirmation'
    })
    .state('profile', {
        url: '/profile',
        templateUrl: profileTemplateUrl,
        controller: 'ProfileCtrl as profile',
 	  })
    .state('tab.tasks', {
        url: '/tasks',
        views: {
          'tab-tasks': {
            templateUrl: tasksTemplateUrl,
            controller: 'TasksCtrl as tasks'
          }
        }
    })
    .state('tab.task', {
        url: '/tasks/:taskId',
        views: {
          'tab-tasks': {
            templateUrl: taskTemplateUrl,
            controller: 'TaskCtrl as task'
          }
        }
    })
    .state('tab.diary', {
        url: '/diary',
        views: {
          'tab-tasks': {
            templateUrl: diaryTemplateUrl,
            controller: 'DiaryCtrl as diaries'
          }
        }
    })
    .state('tab.resources', {
        url: '/resources',
        views: {
          'tab-resources': {
            templateUrl: resourceTemplateUrl,
            controller: 'DiaryCtrl as diaries'
          }
        }
    })
    .state('tab.stresslevel', {
        url: '/stresslevel',
        views: {
          'tab-tasks': {
            templateUrl: stressLevelTemplateUrl,
            controller: 'StressLevelCtrl as stresslevels'
          }
        }
    })
 	  .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: settingsTemplateUrl,
            controller: 'SettingsCtrl as settings',
          }
        }
      });
    this.$urlRouterProvider.otherwise('tab/tasks');
  }
  isAuthorized($auth) {
    return $auth.awaitUser();
  }
}
 
RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

class RoutesRunner extends Runner {
  run() {
    this.$rootScope.$on('$stateChangeError', (...args) => {
      const err = _.last(args);
 
      if (err === 'AUTH_REQUIRED') {
        this.$state.go('login');
      }
    });
  }
}
 
RoutesRunner.$inject = ['$rootScope', '$state'];
 
export default [RoutesConfig, RoutesRunner];