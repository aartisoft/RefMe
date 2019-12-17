import React from 'react';
import { Clipboard, Button, Text, StyleSheet, StatusBar, View } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import axios from 'axios';

import { connect } from 'react-redux';
import * as referenceAction from '../actions/referenceAction';

class ReferencesScreen extends React.Component {
	
  reference(ref, index) {
    console.log("rendering reference: " + ref);
    return (
      <React.Fragment>
        <Text> {ref.author + ", " + ref.initials + ", " + ref.title + ", " + ref.website_name + ", " + ref.date + ". Available from: " + ref.URL} </Text>
        <Text> </Text>
      </React.Fragment>
    )
  }

  constructor(props) {
  	super(props)
  	
  	this.writeToClipboard=this.writeToClipboard.bind(this)
  }

  render() {

    const { references } = this.props;
    
    isReferences = references.length > 0

  	return (
  		<View style={styles.container}>
        <Text style={styles.headerText}>
          Your references
        </Text>
        {isReferences ? (
          <React.Fragment>
  			   {references.map((reference, i) => this.reference(reference, i))}
          </React.Fragment>
        ) : (
          <Text>No references added yet</Text>
        )}
        
        <Button
        	onPress={this.writeToClipboard}
        	title="Write to Clipboard"
        />
  		</View>
  	);
  }

	async writeToClipboard(){
	  const { references } = this.props;
	  var content = ""
	  references.forEach (ref => {
	  	content += ref.author + ", " + ref.initials + ", " + ref.title + ", " + ref.website_name + ", " + ref.date + ". Available from: " + ref.URL
	  	content += " /////////////////////// "
	  })
	  await Clipboard.setString(content);
	}

}

ReferencesScreen.navigationOptions = {
  title: 'Refs',
  tabBarLabel: 'Refs',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

const styles = StyleSheet.create({
  baseText: {
    color: '#000',
    paddingTop: 10,
    paddingBottom: 10
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline' 
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
});

const mapStateToProps = (state) => ({
    references: state.references,
})

const mapDispatchToProps = (dispatch) => ({
  addReference: ref => dispatch(referenceAction.addReference(ref)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReferencesScreen)
