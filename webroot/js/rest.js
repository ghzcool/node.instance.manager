const rest = new function () {
	var _rest = this;

	var getOnErrorHandler = function (callback) {
		return function (response) {
			if(!!response.responseJSON && response.responseJSON.status === 401) {
				api.showLogin();
			}
			!!callback && callback(response.responseJSON);
		};
	};

	var getHeaders = function(config) {
		return $.extend({
			"Authorization": "Token " + sessionStorage.getItem("token")
		}, config || {});
	};

	_rest.getSelf = function (success, failure) {
		$.ajax({
			type: 'GET',
			url: '/me',
			data: null,
			dataType: 'json',
			success: success,
			error: getOnErrorHandler(failure),
			headers: getHeaders()
		});
	};

	_rest.login = function (login, password, success, failure) {
		$.ajax({
			type: 'POST',
			url: '/login',
			data: {
				login: login,
				password: password
			},
			dataType: 'json',
			success: success,
			error: getOnErrorHandler(failure),
			headers: getHeaders()
		});
	};

	_rest.renew = function (success, failure) {
		$.ajax({
			type: 'GET',
			url: '/token/renew',
			data: null,
			dataType: 'json',
			success: success,
			error: getOnErrorHandler(failure),
			headers: getHeaders()
		});
	};

	_rest.logout = function (success, failure) {
		$.ajax({
			type: 'GET',
			url: '/logout',
			data: null,
			dataType: 'json',
			success: success,
			error: getOnErrorHandler(failure),
			headers: getHeaders()
		});
	};

	_rest.getNodes = function (success, failure) {
		$.ajax({
			type: 'GET',
			url: '/nodes',
			data: null,
			dataType: 'json',
			success: success,
			error: getOnErrorHandler(failure),
			headers: getHeaders()
		});
	};

	_rest.getNode = function (id, success, failure) {
		$.ajax({
			type: 'GET',
			url: '/node',
			data: {id: id},
			dataType: 'json',
			success: success,
			error: getOnErrorHandler(failure),
			headers: getHeaders()
		});
	};

	_rest.getNodeTypes = function (success, failure) {
		$.ajax({
			type: 'GET',
			url: '/node/types',
			data: null,
			dataType: 'json',
			success: success,
			error: getOnErrorHandler(failure),
			headers: getHeaders()
		});
	};

	_rest.getSystemInfo = function (success, failure) {
		$.ajax({
			type: 'GET',
			url: '/system',
			data: null,
			dataType: 'json',
			success: success,
			error: getOnErrorHandler(failure),
			headers: getHeaders()
		});
	};

	_rest.createNode = function (data, success, failure) {
		$.ajax({
			type: 'POST',
			url: '/node',
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			success: success,
			error: getOnErrorHandler(failure),
			headers: getHeaders()
		});
	};

	_rest.updateNode = function (data, success, failure) {
		$.ajax({
			type: 'PUT',
			url: '/node',
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			success: success,
			error: getOnErrorHandler(failure),
			headers: getHeaders()
		});
	};

	_rest.deleteNode = function (id, success, failure) {
		$.ajax({
			type: 'DELETE',
			url: '/node',
			data: {id: id},
			dataType: 'json',
			success: success,
			error: getOnErrorHandler(failure),
			headers: getHeaders()
		});
	};

	_rest.startNode = function (id, success, failure) {
		$.ajax({
			type: 'PUT',
			url: '/node/start',
			data: {id: id},
			dataType: 'json',
			success: success,
			error: getOnErrorHandler(failure),
			headers: getHeaders()
		});
	};

	_rest.stopNode = function (id, success, failure) {
		$.ajax({
			type: 'PUT',
			url: '/node/stop',
			data: {id: id},
			dataType: 'json',
			success: success,
			error: getOnErrorHandler(failure),
			headers: getHeaders()
		});
	};
}();