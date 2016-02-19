'use strict '

var React = require('react-native');
var _ = require('lodash');
var MD = require('react-native-material-design');

var {
	Card, Button, Toolbar
} = MD;

var {
	AppRegistry,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Navigator,
	ScrollView,
	ViewPager,
	BackAndroid,
	ViewPagerAndroid,
	Image,
	ListView,
	ProgressBarAndroid
} = React;

var styles = StyleSheet.create({
	toolbar: {
		backgroundColor: '#9E9E9E',
		height: 56,
	}
});

var DetailView = React.createClass({
	getInitialState: function() {
		return {
			isLoading: true,
			logdetail: {}
		};
	},

	_getData: function() {
		var key = this.props.searchKey;

		console.log(key);

		fetch('http://42.96.171.42:9001/api/log/detail/' + key)
			.then((response) => response.json())
			.then((log) => {
				this.setState({
					isLoading: false,
					logdetail: log
				});
			})
			.catch((err) => {
				console.warn(err);
			});
	},

	componentDidMount: function() {
		console.log('aaa');
		this._getData();
	},

	renderContent: function() {
		if (this.state.isLoading) {
			return (
				<View  style={{alignItems: 'center', marginTop: 56}}>
          			<ProgressBarAndroid/>
        		</View>
			);
		}

		return (
			<View style={{flex: 1,  marginTop: 56}}>
				<ScrollView style={{padding: 5}}>
		            <Text style={{color: '#212121', lineHeight :20}}>{this.state.logdetail.message}</Text>
		        </ScrollView>
		        <View style={{backgroundColor: '#607D8B', padding: 5}}>
					<Text style={{color: '#F5F5F5'}}>系统： {this.state.logdetail.systemAlias}</Text>
					<Text style={{color: '#F5F5F5'}}>时间： {this.state.logdetail.time}</Text>
				</View>
			</View>
		);
	},

	goBack: function() {
		this.props.navigator.pop();
	},

	render: function() {
		return (
			<View style={{flex: 1}}>
				<Toolbar
					title={'日志详情'}
					primary={'googleGrey'}
					onIconPress= {this.goBack}
					icon={'keyboard-backspace'} />
				{this.renderContent()}
			</View>
		);
	}
});

module.exports = DetailView;