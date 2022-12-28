import React from 'react';
import { shallow } from 'enzyme';
import Header from '../../components/Header';

// Creates a basic snapshot
// test('Render Header', () => {
//     const renderer = new ReactShallowRenderer();
//     renderer.render(<Header />);
//     expect(renderer.getRenderOutput()).toMatchSnapshot();
// });

test('Render Header', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper).toMatchSnapshot();
    //expect(wrapper.find('h1').text()).toBe('Expensify');
})
