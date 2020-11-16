import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import renderSnapshot from 'react-test-renderer'
import CarouselCard from './CarouselCard'

test('Should render title and distance props', () => {
  const park = {
    title: 'Adventure Park',
    uri: 'https://picsum.photos/id/1043/5184/3456',
    distance: '297',
    favorited: false,
  }

  const { getByText } = render(
    <CarouselCard {...park} onPress={() => {}} onFavoritePress={() => {}} />
  )

  const title = getByText(park.title)
  const distance = getByText(`${park.distance}km Away`)

  expect(title).toBeDefined()
  expect(distance).toBeDefined()
})

test('renders with no uri and favorited set to true', () => {
  const park = {
    title: 'Adventure Park',
    distance: '297',
    favorited: true,
  }

  const tree = renderSnapshot
    .create(
      <CarouselCard {...park} onPress={() => {}} onFavoritePress={() => {}} />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

describe('advisory banner', () => {
  test('if only 1 advisory, display advisory headline', () => {
    const AdvisoryHeadline = 'Advisory Headline'
    const park = {
      title: 'Adventure Park',
      distance: '297',
      favorited: true,
      advisories: [{ Headline: AdvisoryHeadline }],
      alerts: [],
    }

    const { getByText } = render(
      <CarouselCard {...park} onPress={() => {}} onFavoritePress={() => {}} />
    )
    const message = getByText(AdvisoryHeadline)

    expect(message).toBeDefined()
  })

  test('more than 1 advisory should condense text', () => {
    const park = {
      title: 'Adventure Park',
      distance: '297',
      favorited: true,
      advisories: [],
      alerts: [],
    }

    //  Only Advisories
    park.advisories = [{ Headline: 'Advisory 1' }, { Headline: 'Advisory 2' }]
    const { getByText, rerender } = render(
      <CarouselCard {...park} onPress={() => {}} onFavoritePress={() => {}} />
    )
    let message = getByText('2 Advisories')
    expect(message).toBeDefined()

    // One Alert and one Advisory
    park.advisories = [{ Headline: 'Advisory 1' }]
    park.alerts = [{ Headline: 'Alert 1' }]
    rerender(
      <CarouselCard {...park} onPress={() => {}} onFavoritePress={() => {}} />
    )
    message = getByText('2 Alerts/Advisories')
    expect(message).toBeDefined()

    //  Only Alerts
    park.advisories = []
    park.alerts = [{ Headline: 'Alert 1' }, { Headline: 'Alert 2' }]
    rerender(
      <CarouselCard {...park} onPress={() => {}} onFavoritePress={() => {}} />
    )
    message = getByText('2 Alerts')
    expect(message).toBeDefined()
  })
})

test('Should call onPress when pressed', () => {
  const onPress = jest.fn()
  const { getByA11yLabel } = render(
    <CarouselCard
      title={'Adventure Park'}
      onPress={onPress}
      onFavoritePress={() => {}}
    />
  )

  const button = getByA11yLabel('navigate to park details')
  fireEvent.press(button)

  expect(onPress).toHaveBeenCalled()
})

test('favorites park when heart is pressed', () => {
  const park = {
    title: 'Adventure Park',
    favorited: false,
  }
  const onFavoritePress = jest.fn()

  const { getByA11yLabel } = render(
    <CarouselCard
      {...park}
      onPress={() => {}}
      onFavoritePress={onFavoritePress}
    />
  )

  const heart = getByA11yLabel('favorite park')
  expect(heart).toBeDefined()

  fireEvent.press(heart)
  expect(onFavoritePress).toHaveBeenCalled()
})
