import React from 'react';
import { ScrollView, StyleSheet, StatusBar, View, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { Container, Header, Content, Card, CardItem, Text, Body } from 'native-base';
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
  	
  	this.state = {
      hasLoaded: false,
      articles: [],
  	}

    this.getArticles("machine learning");
  }

  getArticles(keyword) {
  	const PLATFORM_URL = "http://platform.x5gon.org/api/v1"
  	const ENDPOINT = "/search"
  	const url = PLATFORM_URL + ENDPOINT
  	
    if(this.DEBUGGING) { console.log(keyword) }

  	axios.get(url, {
      params: {
        text: keyword,
        type: "text",
        page: 1,
      }
    })
		.then(res => {
			const articles = res.data.rec_materials;

			this.setState({
        hasLoaded: true,
				articles: articles
			})
		})
		.catch(error => {
			console.log(error);
		})
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
    
    this.getArticles(value)
  }

  render() {

  	const { articles, hasLoaded  } = this.state

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
            <Text styles={styles.baseText}>Loading...</Text>   
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
        		{ articles.map((article, i) => {
        		  return ( 
                <TouchableOpacity onPress={ () => {this.openDocument(article.material_id)} } 
                  style={styles.card} key={i}>
                  <Card style={styles.card}>
                		<CardItem style={styles.header}>
                			<Body>
                        <Text>{article.title}</Text>
                        <Text note>{article.provider}</Text>
                      </Body>
                		</CardItem>
                    <CardItem style={styles.footer}>
                      	<Text numberOfLines={4} style={styles.description}>{article.description}</Text>    
                  	</CardItem>
                	</Card>
                </TouchableOpacity>
              );
            })}
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
  },
  header: {
    borderRadius: 20,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    color: '#000'
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
    references: state.references.ids
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addReference: ref => dispatch(referenceAction.addReference(ref))
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentsScreen)
