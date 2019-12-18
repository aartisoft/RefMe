import React from 'react';
import { ScrollView, StyleSheet, StatusBar, View, Dimensions } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import axios from 'axios';
import { Container, Header, Content, Card, CardItem, 
    Body, Text, Icon, Button} from 'native-base';
import moment from 'moment';

import { connect } from 'react-redux';
import * as referenceAction from '../actions/referenceAction';

import Pdf from 'react-native-pdf';

import { Toolbar } from 'react-native-material-ui';

class ArticlesScreen extends React.Component {

  constructor(props) {
  	super(props)

    this.DEBUGGING = false

    this.props.navigation.setParams({ title: "Loading..."})

    const id = this.props.navigation.getParam('material_id', {})

    if(this.DEBUGGING) { 
      console.log("References: ")
      console.log(this.props.references) 
    }

    this.state = {
      hasLoaded: false,
      article: null,
      id: id,
      currentpage: 1,
      lastpage: 1,
      isReferenced: this.props.references.includes(id+"")
    }

  	this.toggleReference = this.toggleReference.bind(this)
    this.getArticle = this.getArticle.bind(this)
  }

  componentDidMount() {
    this.getArticle()
  }

  componentDidUpdate(prevProps) {
    if(prevProps != this.props) {
      const { id } = this.state

      if(id in this.props.documents) {
        if(typeof this.pdf !== "undefined") {
          const startPage = this.props.documents[id].currentpage
          this.pdf.setPage(startPage) 
          this.setState({ currentpage : startPage })
        }
      }
    }
  }

  getArticle() {
    const { id } = this.state

    if(id in this.props.missing) {
      var startPage = 1

      if(id in this.props.documents) {
        startPage = this.props.documents[id].currentpage
      }

      this.setState({
        hasLoaded: true,
        article: this.props.missing[id],
        currentpage: startPage,
      })

      console.log(this.props.missing)

      return;
    }

    const PLATFORM_URL = "http://platform.x5gon.org/api/v1"
    const ENDPOINT = "/oer_materials/" + id
    const url = PLATFORM_URL + ENDPOINT
    
    axios.get(url, {} )
      .then(res => {
        const article = res.data.oer_materials

        console.log("request finished: " + url + " for material: " + id)
        console.log("response obtained: ")
        console.log(res.data)

        if(typeof article !== "undefined") {
          var startPage = 1

          if(id in this.props.documents) {
            startPage = this.props.documents[id].currentpage
          }

          this.setState({
            hasLoaded: true,
            article: article,
            currentpage: startPage,
          })

          this.pdf.setPage(startPage) 

          this.props.navigation.setParams({ article_title: article.title })
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  toggleReference() {
    if(this.DEBUGGING) { console.log("toggling reference") }

    const { id, isReferenced } = this.state

    if(isReferenced) {
      this.props.removeReference(id)  
    } else { 
      this.props.addReference(id)
    }
    
    this.setState({ isReferenced : !this.state.isReferenced })
    if(this.DEBUGGING) { 
      console.log("References:") 
      console.log(this.props.references) 
    }
  }

  updateDocument() {
    if(this.DEBUGGING) { console.log("updating document state") }
    
    const { id, currentpage, lastpage} = this.state

    this.props.updateDocument(id, {
      currentpage: currentpage,
      numberofpages: lastpage,
    })
  }
  
  render() {

    const { hasLoaded, article, currentpage, lastpage, isReferenced } = this.state

    if(hasLoaded) {

      const source = { uri:article.url, cache:true };
      if(this.DEBUGGING) { console.log(source) }

      return (
        <>
          <Toolbar
            centerElement={article.title}
            rightElement={{
              menu: {
                icon: "more-vert",
                labels: [isReferenced ? "Remove from Bibliography" : "Save To Bibliography"]
              }
            }}
            onRightElementPress={ (label) => {
              switch(label.index) {
                case 0:
                this.toggleReference()
                break;

                default:
                console.log("Unknown action: " + label.index)
              }
            }}
          />
          <Pdf
            ref={(pdf) => { this.pdf = pdf; }}
            source={source}
            onLoadComplete={(numberOfPages,filePath)=>{
                if(this.DEBUGGING) { console.log(`number of pages: ${numberOfPages}`) }
                this.setState({ lastpage : numberOfPages })
            }}
            onPageChanged={(page,numberOfPages)=>{
                if(this.DEBUGGING) { console.log(`current page: ${page}`) }
                this.updateDocument()
                this.setState({ currentpage : page})
            }}
            onError={(error)=>{
                if(this.DEBUGGING) { console.log(error) }
            }}
            onPressLink={(uri)=>{
                if(this.DEBUGGING) { console.log(`Link presse: ${uri}`) }
            }}
            style={styles.pdf}/>
          <View style={styles.floatingButtonsContainer}>
            <Button light style={styles.floatingButton}
              onPress={() => {
                if(this.DEBUGGING) { console.log(currentpage + " : " + lastpage) }

                if(currentpage>1) { 
                  this.pdf.setPage(currentpage - 1) 
                  this.setState({ currentpage : currentpage - 1})
                }
              }}>
              <Icon name='arrow-up' />
            </Button>
            <Button light style={styles.floatingButton}
              onPress={() => {
                if(this.DEBUGGING) { console.log(currentpage + " : " + lastpage) }

                if(currentpage<lastpage) { 
                  this.pdf.setPage(currentpage + 1) 
                  this.setState({ currentpage : currentpage + 1})
                }
              }}>
              <Icon name='arrow-down' />
            </Button>
          </View>
        </>
      )
    } else {
      return (
        <>
          <Toolbar
            centerElement="Loading..."
          />
          <View style={styles.centerContainer}>
            <Text styles={styles.baseText}>Loading...</Text>   
          </View>
        </>
      )
    }
	}
}

ArticlesScreen.navigationOptions = {
  header: null,
}

const styles = StyleSheet.create({
  header: {
    borderRadius: 20,
  },
  footer: {
    borderRadius: 20,
  },
  card: {
    margin: 20,
    borderRadius: 20,
  },
  baseText: {
    color: '#000'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline' 
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomCard: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  baseText: {
    color: '#000'
  },
  pdf: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  floatingButtonsContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  floatingButton: {
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
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArticlesScreen)
