import React from 'react';
import { Clipboard, StyleSheet, StatusBar, View, ScrollView,TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Container, Header, Content, Card, CardItem, 
    Body, Text, Icon, Button} from 'native-base';

import { connect } from 'react-redux';
import * as referenceAction from '../actions/referenceAction';

import { Toolbar } from 'react-native-material-ui';

class ReferencesScreen extends React.Component {
	
  constructor(props) {
    super(props)
    
    this.writeToClipboard=this.writeToClipboard.bind(this)
    this.getReferenceObject=this.getReferenceObject.bind(this)
    this.getArticleReference=this.getArticleReference.bind(this)

    this.DEBUGGING = true

    this.state = {
      references: [],
      documents: [],
    }

    this.props.references.map( (id) => {
      this.getReferenceObject(id)    
    })

    if(this.DEBUGGING) {
      console.log("Finding documents: ")
      console.log(this.props.docs)
    }

    for(var id in this.props.docs) {
      const doc = this.props.docs[id]
      this.getArticleReference(id, doc)
    }
  }

  getReferenceObject(id) {
    const PLATFORM_URL = "http://platform.x5gon.org/api/v1"
    const ENDPOINT = "/oer_materials/" + id
    const url = PLATFORM_URL + ENDPOINT

    if(this.DEBUGGING) { console.log("Getting reference: " + id) }
    
    axios.get(url, {} )
      .then(res => {
        const article = res.data.oer_materials

        if(typeof article !== "undefined") {
          this.setState({
            references: [...this.state.references, article],
          })
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  getArticleReference(id, doc) {
    const PLATFORM_URL = "http://platform.x5gon.org/api/v1"
    const ENDPOINT = "/oer_materials/" + id
    const url = PLATFORM_URL + ENDPOINT
    
    if(this.DEBUGGING) { console.log("Getting document: " + id) }

    axios.get(url, {} )
      .then(res => {
        const article = res.data.oer_materials

        if(typeof article !== "undefined") {
          this.setState({
            documents: [...this.state.documents, {...article, meta: doc}],
          })
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  reference(ref, index) {
    if(this.DEBUGGING) { console.log("rendering reference: " + ref) }
    const date = ref.creation_date===null ? ref.retrieved_date : ref.creation_date

    var initials = ref.provider.provider_name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    if(this.DEBUGGING) { console.log(initials) }

    return (
      <>
        <Text style={styles.bibliographyText}> {ref.provider.provider_name + ", " + initials + ", " + ref.title + ", " + ref.provider.provider_name + ", " + 
          date + ". Available from: " + ref.url} </Text>
        <Text> </Text>
      </>
    )
  }

  document(doc, index) {
    if(this.DEBUGGING) { console.log("rendering document: " + doc.material_id) }

    return (
      <TouchableOpacity onPress={ () => {this.openDocument(doc.material_id)} } 
        style={styles.card} key={index}>
        <Card style={styles.card}>
          <CardItem style={styles.header}>
            <Body>
              <Text>{doc.title}</Text>
              <Text note>{doc.provider.provider_name}</Text>
            </Body>
          </CardItem>
        </Card>
      </TouchableOpacity>
    )
  }

  render() {

    const { references, documents } = this.state;
    
    const isReferences = references.length > 0
    const isDocuments = documents.length > 0

  	return (
      <>
        <Toolbar
          centerElement="MyRefs"
        />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.centerContainer}>
            <Text style={styles.headerText}>
              Recent Articles
            </Text>

            {isDocuments ? (
              <View style={styles.itemsView}>
               {documents.map((document, i) => this.document(document, i))}
              </View>
            ) : (
              <View style={styles.loadingView}>
                <Text>{this.props.documents > 0 ? 'Loading...' : 'No references added yet'}</Text>
              </View>
            )}
          </View>

          <View style={styles.centerContainer}>
            <Text style={styles.headerText}>
              Your bibliography
            </Text>

            {isReferences ? (
              <View style={styles.itemsView}>
               {references.map((reference, i) => this.reference(reference, i))}
              </View>
            ) : (
              <View style={styles.loadingView}>
                <Text>{this.props.documents > 0 ? 'Loading...' : 'No documents added yet'}</Text>
              </View>
            )}
          </View>
          
          <Button
            style={styles.button}
            onPress={this.writeToClipboard}
          >
            <Text>Write To Clipboard</Text>
          </Button>
        </ScrollView>
      </>
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
  header: null,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

const styles = StyleSheet.create({
  card: {
    width: `100%`,
    borderRadius: 20,
  },
  header: {
    borderRadius: 20,
  },
  baseText: {
    color: '#000',
    paddingTop: 10,
    paddingBottom: 10
  },
  headerText: {
    fontSize: 20,
    paddingBottom: 10,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  button: {
    marginTop: 40,
  },
  loadingView: {
    width: '100%',
    height: 200,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsView: {
    flexGrow: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  bibliographyText: {
    fontSize: 8,
  }
});

const mapStateToProps = (state) => ({
    references: state.references.ids,
    docs: state.references.docs,
})

const mapDispatchToProps = (dispatch) => ({
  addReference: ref => dispatch(referenceAction.addReference(ref)),
  removeReference: ref => dispatch(referenceAction.removeReference(ref)),
  updateDocument: (id, doc) => dispatch(referenceAction.updateDocument(id, doc)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReferencesScreen)
