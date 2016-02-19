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
	PullToRefreshViewAndroid,
	ProgressBarAndroid,
	SwitchAndroid
} = React;

var _page = 1;
var datas = [];

var styles = StyleSheet.create({
	toolbar: {
		backgroundColor: '#9E9E9E',
		height: 56,
	},
	layout: {
		flex: 1,
	},
	listlayout: {
		flex: 1,
		marginTop: 56,
	},
	scrollview: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	centerText: {
		alignItems: 'center',
	},
	noDataText: {
		marginTop: 50,
		color: '#888888',
	},
});

var LogListView = React.createClass({
	getInitialState: function() {
		var ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		return {
			isLoading: true,
			isRefreshing: false,
			isLoadingTail: false,
			totalCount: 0,
			dataSource: ds.cloneWithRows([])
		};
	},

	componentDidMount: function() {
		console.log('getdata');
		_page = 1;
		this._getData();
	},

	loadMore: function() {
		this.setState({
			isLoadingTail: true
		});

		_page++;
		this._getData();
	},

	_onRefresh: function() {
		this.setState({
			isRefreshing: true
		});

		_page = 1;
		this._getData();
	},

	_getData: function() {
		var key = this.props.searchKey;
		if (key == "") {
			key = "all";
		}

		console.log(key);

		fetch('http://42.96.171.42:9001/api/logs/' + key + '/' + _page)
			.then((response) => response.json())
			.then((items) => {
				if (_page == 1) {
					datas = [];
				}
				_.forEach(items.list, function(item) {
					datas.push(item);
				});

				this.setState({
					isLoading: false,
					isRefreshing: false,
					isLoadingTail: false,
					totalCount: items.recordCount,
					dataSource: this.state.dataSource.cloneWithRows(datas)
				})
			})
			.catch((err) => {
				console.warn(err);
			});
	},

	selectLog: function(log) {
		//使用navigator导航
		this.props.navigator.push({
			key: log.id,
			name: 'detail'
		});
	},

	//list中row的间隔
	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View key= {'SEP_' + sectionID + '_' +rowID} style={{height: 1, backgroundColor: '#B6B6B6'}}></View>
		);
	},

	//list中每一行
	renderRow: function(rowData, sectionID, rowID, highlightRow) {
		return (
			<TouchableOpacity key={rowData.id} onPress={() => this.selectLog(rowData)}>
                <View style={{ flex: 1, backgroundColor: '#fff'}}>
                	<View style={{ padding: 5 }}>
                		<Text style={{ color:'#212121', fontSize:12,}}>{rowData.message}</Text>
                	</View>
                    <View style={{ flexDirection: 'row',  justifyContent: 'space-between',  padding: 5}}>
						<Text style={{color:'#727272', fontSize:12,}}>{rowData.systemAlias}</Text>
                    	<Text style={{color:'#727272', fontSize:12,}}>{rowData.time}</Text>
                    </View>
            	</View>
            </TouchableOpacity>
		);
	},

	onEndReached: function() {
		//this.loadMore();
		console.log('onEndReached');
	},

	renderFooter: function() {
		if (!this.state.isLoadingTail) {
			return (
				<Button value="加载更多" onPress={this.loadMore}></Button>
			);
		}

		//显示加载中
		return (
			<View  style={{alignItems: 'center'}}>
          		<ProgressBarAndroid/>
        	</View>
		);
	},

	renderContent: function() {
		//显示加载中
		if (this.state.isLoading) {
			return (
				<View style={{alignItems: 'center', marginTop: 56}}>
	          		<ProgressBarAndroid/>
	        	</View>
			);
		}

		var content = this.state.dataSource.getRowCount() === 0 ?
			<View style={[styles.container, styles.centerText]}>
        		<Text style={styles.noDataText}>没有数据</Text>
      		</View> :
			<ScrollView style={styles.scrollview}>
	            <ListView
	                dataSource = {this.state.dataSource}
	                renderSeparator = {this.renderSeparator}
	                renderRow = {this.renderRow}
	                onEndReached={this.onEndReached}
	                renderFooter={this.renderFooter}
	            />
			</ScrollView>;

		//显示列表
		return (
			<PullToRefreshViewAndroid
					style={styles.listlayout}
					refreshing={this.state.isRefreshing}
        			onRefresh={this._onRefresh}
					>
				{content}
			</PullToRefreshViewAndroid>
		);
	},

	render: function() {
		var navigator = this.props.navigator;
		return (
			<View style={{flex: 1}}>
				<Toolbar
				 	title={this.props.searchKey == "" ? "overview" : this.props.searchKey}
				 	primary={'googleGrey'}
				 	onIconPress= {this.props.onIconPress}
					icon={navigator && navigator.isChild ? 'keyboard-backspace' : 'menu'}
					actions={[{
	                    icon: 'warning',
	                    badge: { value: this.state.totalCount, animate: true },
	                }]}
	                rightIconStyle={{ margin: 10}}
	          	/>
				{this.renderContent()}
			</View>
		);
	}
});

module.exports = LogListView;