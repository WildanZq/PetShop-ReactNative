import React from 'react';
import { Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default class SearchInput extends React.Component {
    render() {
        return (
            <Input
                editable={this.props.editable}
                value={this.props.value}
                inputContainerStyle={{ borderRadius: 12, borderColor: '#fff', borderWidth: 1, backgroundColor: 'rgba(200,200,200,.3)' }}
                placeholder='Cari di PetLover'
                inputStyle={{ paddingLeft: 15, color: '#fff' }}
                placeholderTextColor='#f3f3f3'
                leftIcon={
                    <Ionicons
                        name='md-search'
                        size={24}
                        color='#fff'
                    />
                }
            />
        );
    }
}