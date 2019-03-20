import React from 'react';
import { Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default class SearchInput extends React.Component {
    render() {
        return (
            <Input
                editable={this.props.editable}
                value={this.props.value}
                onChange={this.props.onChange}
                onKeyPress={ this.props.onKeyPress }
                selectTextOnFocus={this.props.selectTextOnFocus}
                onSubmitEditing={this.props.onSubmitEditing}
                inputContainerStyle={{ borderRadius: 10, borderColor: '#fff', borderWidth: 1, backgroundColor: '#fff' }}
                placeholder='Cari di PetLover'
                inputStyle={{ paddingLeft: 15, color: '#00acc1' }}
                placeholderTextColor='#26c6da'
                leftIcon={
                    <Ionicons
                        name='md-search'
                        size={24}
                        color = '#007c91'
                    />
                }
            />
        );
    }
}
