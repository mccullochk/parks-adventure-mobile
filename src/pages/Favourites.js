import React from 'react'
import haversine from 'haversine'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import { useTheme } from 'react-native-paper'
import { DataContext } from '../utils/DataContext'
import ParkList from '../components/ParkList'
import {
  SafeArea,
  Container,
  Placeholder,
  Text,
  FavouriteText,
  InlineIcon,
} from './Favourites.styles'

function Favourites() {
  const theme = useTheme()
  const { parks, location, favoritePark } = React.useContext(DataContext)

  const favoriteParks = parks
    .filter((park) => park.favorited)
    .map((park) => ({
      ...park,
      distance: haversine(location, park.location).toFixed(0),
    }))
    .sort((a, b) => {
      const distanceToA = haversine(location, a.location)
      const distanceToB = haversine(location, b.location)

      return distanceToA - distanceToB
    })

  return (
    <SafeArea>
      <Container>
        {favoriteParks.length > 0 ? (
          <ParkList parks={favoriteParks} onFavoritePress={favoritePark} />
        ) : (
          <Placeholder
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
            }}>
            <Text>
              <Text>Easily access parks by adding them to your list of </Text>
              <FavouriteText>Favourites</FavouriteText>
              <Text>. Add parks by tapping the</Text>
              <InlineIcon>
                <Icon
                  name="heart-outline"
                  color={theme.colors.secondary500}
                  size={24}
                  allowFontScaling={true}
                />
              </InlineIcon>
              <Text>on their cards or details page.</Text>
            </Text>
          </Placeholder>
        )}
      </Container>
    </SafeArea>
  )
}

export default Favourites