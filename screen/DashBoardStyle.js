import { StyleSheet  } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fafafa',
	},
	contentContainer: {
		paddingTop: 15,
	},
	optionIconContainer: {
		marginRight: 12,
	},
	option: {
		backgroundColor: '#fdfdfd',
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderWidth: StyleSheet.hairlineWidth,
		borderBottomWidth: 0,
		borderColor: '#ededed',
	},
	lastOption: {
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	optionText: {
		fontSize: 15,
		alignSelf: 'flex-start',
		marginTop: 1,
	},
	flexContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 10,
		top: 0,
		position: 'absolute',
		top: '50%',
		width: '100%'
	},
	tabBarContainer: {
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: '#000',
		alignItems:"center"
	},
	button: {
		color: 'white',
		fontSize: 14,
	},

});

export default styles;