import angular from 'angular';
import config from'./config';
import dashboard from'./dashboard';
import message from'./message';
import order from'./order';
import post from'./post';
import tag from'./tag';
import task from'./task';
import user from'./user';

angular.module('qr-invite.controllers', [
	'qr-invite.configs',
	'qr-invite.dashboard',
	'qr-invite.messages',
	'qr-invite.orders',
	'qr-invite.posts',
	'qr-invite.tags',
	'qr-invite.tasks',
	'qr-invite.users'
]);
