import React from 'react';
import { ScrollView, StyleSheet, StatusBar, View, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { Container, Header, Content, Card, CardItem, 
  Text, Body, Button } from 'native-base';
import moment from 'moment';

import { connect } from 'react-redux';
import * as referenceAction from '../actions/referenceAction';

import { Toolbar } from 'react-native-material-ui';

class DocumentsScreen extends React.Component {
	
  constructor(props) {
  	super(props)
  	
    this.DEBUGGING = false

  	this.getArticles = this.getArticles.bind(this)
  	this.openDocument = this.openDocument.bind(this)
    this.search = this.search.bind(this)
    this.checkArticlesAreSafe = this.checkArticlesAreSafe.bind(this)
  	
  	this.state = {
      hasLoaded: false,
      articles: [],
      nextPage: 1,
      keyword: "machine learning",
      stillArticles: true,
      colors: [
        "#e056fd",
        "#ffbe76",
        "#ff7979",
        "#badc58",
        "#7ed6df"
      ]
  	}

    this.getArticles(this.state.keyword, this.state.nextPage);
  }

  getArticles(keyword, page, reset=false) {
  	const PLATFORM_URL = "http://platform.x5gon.org/api/v1"
  	const ENDPOINT = "/search"
  	const url = PLATFORM_URL + ENDPOINT
  	
    if(this.DEBUGGING) { console.log(keyword) }

  	axios.get(url, {
      params: {
        text: keyword,
        type: "text",
        page: page,
      }
    })
		.then(res => {
      var articles = this.state.articles
      res.data.rec_materials.map( (article) => {
        console.log("next")
        articles.push(article)
      })

      if(reset) { articles = res.data.rec_materials }

      const nextPage = this.state.nextPage+1
      const maxPages = res.data.metadata.max_pages

      console.log(nextPage + " / " + maxPages)

			this.setState({
				articles: articles,
        hasLoaded: true,
        nextPage: nextPage,
        stillArticles: nextPage < maxPages 
			})

      this.checkArticlesAreSafe()
		})
		.catch(error => {
			console.log(error);
		})
  }

  checkArticlesAreSafe() {
    const { articles } = this.state

    for(var i=0; i<articles.length; i++) {
      const id = articles[i].material_id
      const missingArticle = { ...articles[i] }

      const providerName = articles[i].provider
      missingArticle['provider'] = {
        provider_id: -1,
        provider_name: providerName,
        provider_domain: "unknown",
      }

      console.log("Checking article: " + id)

      const PLATFORM_URL = "http://platform.x5gon.org/api/v1"
      const ENDPOINT = "/oer_materials/" + id
      const url = PLATFORM_URL + ENDPOINT

      axios.get(url, {} )
        .then(res => {
          const article = res.data.oer_materials
          
          if(typeof article === "undefined") {
            this.props.uploadMissingDocument(id, missingArticle)
          }
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  openDocument(material_id) {
    console.log("Running...")
    const { articles  } = this.state
    
  	this.props.navigation.navigate('Articles', {
  		material_id: material_id,
  	})
  }

  search(event) {
    const value = event._dispatchInstances.memoizedProps.value
    this.setState({ 
      keyword : value, 
      nextPage : 1,
    })

    this.getArticles(value, 1, true)
  }

  render() {

  	const { articles, hasLoaded, stillArticles, colors } = this.state

    if(this.DEBUGGING) { console.log("DocumentsScreen.render: has it loaded? " + hasLoaded) }

    return (
      <>
        <Toolbar
          centerElement="MyRefs"
          searchable={{
              autoFocus: true,
              placeholder: 'Search',
              onSubmitEditing: this.search,
          }}
        />
        {!hasLoaded ? (
          <View style={styles.centerContainer}>
            <Button
                style={styles.button}
                onPress={ () => {this.getArticles(this.state.keyword, this.state.nextPage)} }
              >
              <Body>
                <Text style={styles.baseText}>Loading...</Text>
              </Body>
            </Button>   
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.centerContainer}>
              <Text style={{ color: '#fff', paddingTop : 10, paddingBottom: 20 }}>{"Showing " + articles.length + " results for " + this.state.keyword + ":"}</Text>
            </View>

        		{ articles.map((article, i) => {
              var author = article.provider

              if(typeof author === "object") {
                author = article.provider.provider_name
              }

              const color = colors[i%5]

        		  return ( 
                <TouchableOpacity onPress={ () => {this.openDocument(article.material_id)} } 
                  style={{...styles.card, marginTop: 10, marginBottom: 10}} key={i}>
                  <Card style={{...styles.card, backgroundColor: color}}>
                		<CardItem style={{...styles.header, backgroundColor: color}}>
                			<Body>
                        <Text style={styles.headerText}>{article.title}</Text>
                        <Text style={styles.baseText}>{author}</Text>
                      </Body>
                		</CardItem>
                    <CardItem style={{...styles.footer, backgroundColor: color}}>
                      	<Text numberOfLines={4} style={styles.baseText}>
                          {article.description==null ? "No description" : article.description}
                        </Text>    
                  	</CardItem>
                	</Card>
                </TouchableOpacity>
              );
            })}
            {stillArticles ? (
              <Button
                style={styles.button}
                onPress={ () => {this.getArticles(this.state.keyword, this.state.nextPage)} }
              >
                <Body>
                  <Text style={styles.baseText}>View more</Text>
                </Body>
              </Button>
            ) : null}
          </ScrollView>
        )}
      </>
    )
  }
}

DocumentsScreen.navigationOptions = {
  title: 'Docs',
  tabBarLabel: 'Docs',
  header: null,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

const styles = StyleSheet.create({
  footer: {
    borderRadius: 20,
  },
  card: {
    borderRadius: 20,
    borderColor: '#000'
  },
  header: {
    borderRadius: 20,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#130f40',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#130f40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    color: '#fff',
    fontSize: 12,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
  },
  button: {
    backgroundColor: "#686de0", 
    marginTop: 10,
    borderRadius: 20,
    borderColor: '#000'
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    references: state.references.ids
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addReference: ref => dispatch(referenceAction.addReference(ref)),
    removeReference: ref => dispatch(referenceAction.removeReference(ref)),
    updateDocument: (id, doc) => dispatch(referenceAction.updateDocument(id, doc)),
    uploadMissingDocument: (id, doc) => dispatch(referenceAction.uploadMissingDocument(id, doc)),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentsScreen)
