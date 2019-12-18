import React from 'react';
import { Clipboard, StyleSheet, StatusBar, View, ScrollView,TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Container, Header, Content, Card, CardItem, 
    Body, Text, Icon, Button, Left, Center, Right} from 'native-base';

import { connect } from 'react-redux';
import * as referenceAction from '../actions/referenceAction';

import { Toolbar } from 'react-native-material-ui';

class ReferencesScreen extends React.Component {
	
  constructor(props) {
    super(props)
    
    this.writeToClipboard=this.writeToClipboard.bind(this)
    this.getReferenceObject=this.getReferenceObject.bind(this)
    this.getArticleReference=this.getArticleReference.bind(this)
    this.updateAesthetic = this.updateAesthetic.bind(this)
    this.openDocument = this.openDocument.bind(this)
    this.reference = this.reference.bind(this)
    this.document = this.document.bind(this)

    this.DEBUGGING = true
    this.RESET_STATE = false

    this.state = {
      references: [],
      documents: [],
    }
  }

  openDocument(material_id) {
    console.log("Running...")
    const { articles  } = this.state
    
    this.props.navigation.navigate('Articles', {
      material_id: material_id,
    })
  }

  updateAesthetic() {
    this.setState({
      references: [],
      documents: [],
    })

    this.props.references.map( (id) => {
      this.getReferenceObject(id)    
    })

    if(this.DEBUGGING) {
      console.log("Finding documents: ")
      console.log(this.props.documents)
    }

    for(var id in this.props.documents) {
      const doc = this.props.documents[id]
      this.getArticleReference(id, doc)
    }
  }

  componentDidMount() {
    if(this.RESET_STATE) { this.props.resetState() }

    this.updateAesthetic()

    this.didFocusSubsription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        console.log("ReferencesScreen in focus")
        this.updateAesthetic()
      }
    )
  }

  componentWillUnmount() {
    this.didFocusSubsription.remove()
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("ReferencesScreen.componentDidUpdate")
    
    if(typeof prevProps.documents === "undefined" ||
      typeof prevProps.references === "undefined") {
      console.log("props undefined")
      return false
    }

    const isNewDocuments = prevProps.documents != this.props.documents
    const isNewReferences = prevProps.references != this.props.references
    
    if(isNewReferences || isNewDocuments) {
      console.log("props have changed")
      this.updateAesthetic()
      return true
    }

    console.log("props are identical")
    return false
  }

  getReferenceObject(id) {
    if(id in this.props.missing) {
      this.setState({
        references: [...this.state.references, this.props.missing[id]],
      })

      return;
    }

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
    if(id in this.props.missing) {
      this.setState({
        documents: [...this.state.documents, {...this.props.missing[id], meta: doc}],
      })

      return;
    }

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
        <Text style={styles.bibliographyText}> {(index+1) + ": " + ref.provider.provider_name + ", " + initials + ", " + ref.title + ", " + ref.provider.provider_name + ", " + 
          date + ". Available from: " + ref.url} </Text>
        <Text> </Text>
      </>
    )
  }

  document(doc, index) {
    if(this.DEBUGGING) { 
      console.log("rendering document with meta: ")
      console.log(doc.meta)
    }

    console.log(this.props.documents)
    const currentpage = this.props.documents[doc.material_id].currentpage

    return (
      <TouchableOpacity onPress={ () => {this.openDocument(doc.material_id)} } 
        style={styles.card} key={index}>
        <Card style={styles.card}>
          <CardItem style={styles.header}>
            <Body>
              <Text>{doc.title}</Text>
              <Text note>{doc.provider.provider_name}</Text>
            </Body>
            <Right>
              <Text>{"page " + currentpage + " / " + doc.meta.numberofpages}</Text>
            </Right>
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
          <View style={styles.sectionContainer}>
            <Text style={styles.headerText}>
              Recent Articles
            </Text>

            {isDocuments ? (
              <View style={styles.itemsView}>
               {documents.map((document, i) => this.document(document, i))}
              </View>
            ) : (
              <View style={styles.loadingView}>
                <Text>{this.props.documents > 0 ? 'Loading...' : 'No documents read recently'}</Text>
              </View>
            )}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.headerText}>
              Your bibliography
            </Text>

            {isReferences ? (
              <View style={styles.itemsView}>
               {references.map((reference, i) => this.reference(reference, i))}
              </View>
            ) : (
              <View style={styles.loadingView}>
                <Text>{this.props.documents > 0 ? 'Loading...' : 'No references added yet'}</Text>
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
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  sectionContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 0,
    marginBottom: 20,
  },
  button: {
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
    documents: state.references.docs,
    missing: state.references.missing,
})

const mapDispatchToProps = (dispatch) => ({
  addReference: ref => dispatch(referenceAction.addReference(ref)),
  removeReference: ref => dispatch(referenceAction.removeReference(ref)),
  updateDocument: (id, doc) => dispatch(referenceAction.updateDocument(id, doc)),
  resetState: () => dispatch(referenceAction.resetState())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReferencesScreen)
