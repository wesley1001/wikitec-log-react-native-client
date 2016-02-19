'use strict';

var React = require('react-native');

var {
	AppRegistry, View, Navigator, Text, BackAndroid, StyleSheet, DrawerLayoutAndroid, Image, ToolbarAndroid
} = React;

var MD = require('react-native-material-design');
var {
	Card, Button, Avatar, Drawer, Divider, COLOR, TYPO
} = MD;

var styles = StyleSheet.create({
	header: {
		paddingTop: 16
	},
	text: {
		marginTop: 20
	}
});

var ListView = require('./log/list');
var DetailView = require('./log/detail');

var _navigator; //用来保存navigator

//监听后退按钮的press事件，用来回退页面
BackAndroid.addEventListener('hardwareBackPress', () => {
	if (_navigator.getCurrentRoutes().length === 1) {
		return false;
	}
	_navigator.pop();
	return true;
});

var App = React.createClass({
	configureScene: function(route, routeStack) {
		if (route.name == "detail") {
			return Navigator.SceneConfigs.FloatFromRight;
		}
		return Navigator.SceneConfigs.FadeAndroid;
	},

	componentDidMount: function() {

	},

	renderScene: function(router, navigator) {
		var Component = null;
		var key = "";

		_navigator = navigator;

		switch (router.name) {
			case 'list.overview':
				Component = ListView;
				key = "";
				break;
			case 'list.hcs':
				Component = ListView;
				key = "hcs";
				break;
			case 'list.ims':
				Component = ListView;
				key = "ims";
				break;
			case 'list.crm':
				Component = ListView;
				key = "crm";
				break;
			case 'list.mms':
				Component = ListView;
				key = "mms";
				break;
			case 'list.lms':
				Component = ListView;
				key = "lms";
				break;
			case 'detail':
				Component = DetailView;
				key = router.key;
				break;
		}

		//注意这里将navigator作为属性props传递给了各个场景组件
		return <Component searchKey = {key} navigator = {navigator} onIconPress= {this.onIconPress} />;
	},

	onIconPress: function() {
		//关闭drawer
		this.refs['DRAWER'].openDrawer();
	},

	onNavPress: function(target) {
		console.log('onNavPress: ' + target);

		_navigator.push({
			name: target
		});

		this.setState({
			route: target
		});

		//关闭drawer
		this.refs['DRAWER'].closeDrawer();
	},

	getInitialState: function() {
		return {
			route: 'list.overview'
		}
	},

	onActionSelected: function(position) {
		if (position === 0) { // index of 'Settings'

		}
	},

	render: function() {
		var navigationView = (
			<Drawer theme='light'>
			 	<Drawer.Header image={<Image source={require('./img/nav.jpg')} />}>
                    <View style={styles.header}>
                    	<Image source={{ uri: "http://wikitec.com.cn/img/icon.png" }} 
                    		resizeMode = {'stretch'}
                    		style={{ height:40, width: 160, marginTop:30}}></Image>
                        <Text style={[styles.text, COLOR.paperGrey50, TYPO.paperFontSubhead]}>系统日志</Text>
                    </View>
                </Drawer.Header>
				<Drawer.Section
                    items={[{
                    	icon: 'apps',
                        value: 'Overview',
                        label: ' ',
                        active: !this.state.route || this.state.route  === 'list.overview',
                        onPress: () => this.onNavPress('list.overview'),
                        onLongPress: () => this.onNavPress('list.overview')
                    },
                    {
                    	icon: 'apps',
                        value: '管理平台IMS',
                        label: ' ',
                        active: !this.state.route  || this.state.route  === 'list.ims',
                        onPress: () => this.onNavPress('list.ims'),
                        onLongPress: () => this.onNavPress('list.ims')
                    },
                    {
                    	icon: 'apps',
                        value: '服务系统HCS',
                        label: ' ',
                        active: !this.state.route  || this.state.route  === 'list.hcs',
                        onPress: () => this.onNavPress('list.hcs'),
                        onLongPress: () => this.onNavPress('list.hcs')
                    },
                    {
                    	icon: 'apps',
                        value: '客户管理系统CRM',
                        label: ' ',
                        active: !this.state.route  || this.state.route  === 'list.crm',
                        onPress: () => this.onNavPress('list.crm'),
                        onLongPress: () => this.onNavPress('list.crm')
                    },
                    {
                    	icon: 'apps',
                        value: '物资管理MMS',
                        label: ' ',
                        active: !this.state.route  || this.state.route  === 'list.mms',
                        onPress: () => this.onNavPress('list.mms'),
                        onLongPress: () => this.onNavPress('list.mms')
                    },
                    {
                    	icon: 'apps',
                        value: '职业技能培训LMS',
                        label: ' ',
                        active: !this.state.route  || this.state.route  === 'list.lms',
                        onPress: () => this.onNavPress('list.lms'),
                        onLongPress: () => this.onNavPress('list.lms')
                    },]}
                />
			</Drawer>
		);
		return (
			<DrawerLayoutAndroid
				ref={'DRAWER'}
				drawerWidth = {240}
				drawerPosition={DrawerLayoutAndroid.positions.Left}
				renderNavigationView={() => navigationView}>
				<Navigator
					initialRoute ={{name: 'list.overview'}}
					configureScene = {this.configureScene}
					renderScene = {this.renderScene}>
				</Navigator>
			</DrawerLayoutAndroid>
		);
	}
});

module.exports = App;