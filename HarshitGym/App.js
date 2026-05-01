import * as React from 'react';
import {
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
  useFocusEffect,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Avatar,
  Button,
  Card,
  Chip,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  Surface,
  Switch,
  Text,
  TextInput,
} from 'react-native-paper';

const Stack = createNativeStackNavigator();
const gymHero = require('./assets/images/gym-hero.png');

const AppThemeContext = React.createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#ef4444',
    secondary: '#14b8a6',
    surface: '#ffffff',
    background: '#f5f7fb',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#f87171',
    secondary: '#2dd4bf',
    surface: '#1f2937',
    background: '#0f172a',
  },
};

const lightNavigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: '#f5f7fb',
    card: '#f5f7fb',
    text: '#111827',
  },
};

const darkNavigationTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: '#0f172a',
    card: '#111827',
    text: '#f8fafc',
  },
};

function useAppTheme() {
  return React.useContext(AppThemeContext);
}

function HeaderThemeSwitch() {
  const { isDarkMode, toggleTheme } = useAppTheme();

  return (
    <View style={styles.headerSwitchWrap}>
      <Text variant="labelMedium" style={[styles.headerSwitchLabel, isDarkMode && styles.darkMutedText]}>
        {isDarkMode ? 'Dark' : 'Light'}
      </Text>
      <Switch value={isDarkMode} onValueChange={toggleTheme} color="#ef4444" />
    </View>
  );
}

function BrandHeader({ kicker, title, subtitle, compact = false }) {
  const { isDarkMode } = useAppTheme();

  return (
    <Surface
      style={[
        styles.brandHeader,
        compact && styles.compactBrandHeader,
        isDarkMode && styles.darkBrandHeader,
      ]}
      elevation={4}>
      <View style={styles.logoStage}>
        <View style={styles.logoShadow} />
        <Avatar.Icon size={compact ? 54 : 64} icon="dumbbell" style={styles.logoBadge} />
      </View>
      <View style={styles.brandTextBlock}>
        <Text variant="labelLarge" style={styles.brandKicker}>
          {kicker}
        </Text>
        <Text variant={compact ? 'headlineSmall' : 'headlineMedium'} style={styles.brandTitle}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodyMedium" style={styles.brandSubtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Surface>
  );
}

function HomeScreen({ navigation }) {
  const { isDarkMode } = useAppTheme();
  const [counts, setCounts] = React.useState({ workouts: 0, meals: 0 });

  const loadCounts = React.useCallback(async () => {
    const [storedWorkouts, storedMeals] = await Promise.all([
      AsyncStorage.getItem('workouts'),
      AsyncStorage.getItem('meals'),
    ]);

    const workouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];
    const meals = storedMeals ? JSON.parse(storedMeals) : [];

    setCounts({
      workouts: Array.isArray(workouts) ? workouts.length : 0,
      meals: Array.isArray(meals) ? meals.length : 0,
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadCounts();
    }, [loadCounts])
  );

  return (
    <ScrollView
      style={[styles.screen, isDarkMode && styles.darkScreen]}
      contentContainerStyle={styles.homeContent}>
      <BrandHeader
        kicker="STARK MODE"
        title="HarshitStarkFitness"
        subtitle="Strength, meals, and discipline tracked in one sharp training hub."
      />

      <ImageBackground source={gymHero} imageStyle={styles.heroImage} style={styles.hero}>
        <View style={styles.heroOverlay}>
          <Text variant="labelLarge" style={styles.heroEyebrow}>
            TODAY'S COMMAND CENTER
          </Text>
          <Text variant="displaySmall" style={styles.heroTitle}>
            Build your next rep.
          </Text>
          <Text variant="bodyLarge" style={styles.heroSubtitle}>
            Log workouts, track nutrition, and review every session with a focused dashboard.
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.statsRow}>
        <Card mode="elevated" style={[styles.statCard, isDarkMode && styles.darkCard]}>
          <Card.Content style={styles.statContent}>
            <Text variant="headlineSmall" style={styles.statValue}>
              {counts.workouts}
            </Text>
            <Text variant="labelMedium" style={styles.statLabel}>
              Workouts
            </Text>
          </Card.Content>
        </Card>
        <Card
          mode="elevated"
          style={[styles.statCard, styles.mealStatCard, isDarkMode && styles.darkCard]}>
          <Card.Content style={styles.statContent}>
            <Text variant="headlineSmall" style={styles.statValue}>
              {counts.meals}
            </Text>
            <Text variant="labelMedium" style={styles.statLabel}>
              Meals
            </Text>
          </Card.Content>
        </Card>
      </View>

      <Card mode="elevated" style={[styles.actionCard, isDarkMode && styles.darkCard]}>
        <Card.Content style={styles.actionContent}>
          <View style={styles.cardTitleRow}>
            <Text variant="titleMedium" style={[styles.sectionTitle, isDarkMode && styles.darkTitle]}>
              Quick actions
            </Text>
            <Chip compact style={styles.statusChip} textStyle={styles.statusChipText}>
              Live
            </Chip>
          </View>
          <Button
            icon="dumbbell"
            mode="contained"
            contentStyle={styles.buttonContent}
            style={styles.primaryButton}
            onPress={() => navigation.navigate('AddWorkout')}>
            Add Workout
          </Button>
          <Button
            icon="food-apple"
            mode="contained-tonal"
            contentStyle={styles.buttonContent}
            onPress={() => navigation.navigate('AddMeal')}>
            Add Meal
          </Button>
          <Button
            icon="history"
            mode="outlined"
            contentStyle={styles.buttonContent}
            onPress={() => navigation.navigate('History')}>
            View History
          </Button>
          <Button
            icon="card-account-mail"
            mode="outlined"
            contentStyle={styles.buttonContent}
            onPress={() => navigation.navigate('Contact')}>
            Contact Us
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

function AddWorkoutScreen({ navigation }) {
  const { isDarkMode } = useAppTheme();
  const [exerciseName, setExerciseName] = React.useState('');
  const [sets, setSets] = React.useState('');
  const [reps, setReps] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const saveWorkout = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      const workout = {
        id: Date.now().toString(),
        exerciseName: exerciseName.trim(),
        sets: Number(sets),
        reps: Number(reps),
        weight: Number(weight),
        createdAt: new Date().toISOString(),
      };

      const storedWorkouts = await AsyncStorage.getItem('workouts');
      const workouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];

      await AsyncStorage.setItem('workouts', JSON.stringify([...workouts, workout]));

      setExerciseName('');
      setSets('');
      setReps('');
      setWeight('');
      setMessage('Workout saved.');
      navigation.navigate('Home');
    } catch (error) {
      setMessage('Could not save workout. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, isDarkMode && styles.darkScreen]}>
      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        <BrandHeader
          kicker="TRAINING ENTRY"
          title="HarshitStarkFitness"
          subtitle="Capture the work while the numbers are fresh."
          compact
        />

        <ImageBackground source={gymHero} imageStyle={styles.formHeroImage} style={styles.formHero}>
          <View style={styles.formHeroOverlay}>
            <Text variant="labelLarge" style={styles.heroEyebrow}>
              STRENGTH LOG
            </Text>
            <Text variant="headlineMedium" style={styles.formHeroTitle}>
              Add Workout
            </Text>
          </View>
        </ImageBackground>

        <Text variant="headlineSmall" style={[styles.formTitle, isDarkMode && styles.darkTitle]}>
          Log Workout
        </Text>
        <Text variant="bodyMedium" style={[styles.formSubtitle, isDarkMode && styles.darkMutedText]}>
          Track the exercise, volume, and load for this session.
        </Text>

        <Card mode="elevated" style={[styles.formCard, isDarkMode && styles.darkCard]}>
          <Card.Content style={styles.formContent}>
            <TextInput
              label="Exercise name"
              mode="outlined"
              value={exerciseName}
              onChangeText={setExerciseName}
              autoCapitalize="words"
            />
            <TextInput
              label="Sets"
              mode="outlined"
              value={sets}
              onChangeText={setSets}
              keyboardType="numeric"
            />
            <TextInput
              label="Reps"
              mode="outlined"
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
            />
            <TextInput
              label="Weight"
              mode="outlined"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              right={<TextInput.Affix text="kg" />}
            />

            {message ? <Text style={styles.formMessage}>{message}</Text> : null}

            <Button
              icon="content-save"
              mode="contained"
              loading={isSaving}
              disabled={isSaving}
              contentStyle={styles.buttonContent}
              style={styles.primaryButton}
              onPress={saveWorkout}>
              Save
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function AddMealScreen({ navigation }) {
  const { isDarkMode } = useAppTheme();
  const [foodName, setFoodName] = React.useState('');
  const [calories, setCalories] = React.useState('');
  const [protein, setProtein] = React.useState('');
  const [carbs, setCarbs] = React.useState('');
  const [fats, setFats] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const saveMeal = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      const meal = {
        id: Date.now().toString(),
        foodName: foodName.trim(),
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fats: Number(fats),
        createdAt: new Date().toISOString(),
      };

      const storedMeals = await AsyncStorage.getItem('meals');
      const meals = storedMeals ? JSON.parse(storedMeals) : [];

      await AsyncStorage.setItem('meals', JSON.stringify([...meals, meal]));

      setFoodName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFats('');
      setMessage('Meal saved.');
      navigation.navigate('Home');
    } catch (error) {
      setMessage('Could not save meal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, isDarkMode && styles.darkScreen]}>
      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        <BrandHeader
          kicker="FUEL ENTRY"
          title="HarshitStarkFitness"
          subtitle="Keep nutrition aligned with your training output."
          compact
        />

        <ImageBackground source={gymHero} imageStyle={styles.formHeroImage} style={styles.formHero}>
          <View style={styles.mealHeroOverlay}>
            <Text variant="labelLarge" style={styles.mealEyebrow}>
              NUTRITION LOG
            </Text>
            <Text variant="headlineMedium" style={styles.formHeroTitle}>
              Add Meal
            </Text>
          </View>
        </ImageBackground>

        <Text variant="headlineSmall" style={[styles.formTitle, isDarkMode && styles.darkTitle]}>
          Log Meal
        </Text>
        <Text variant="bodyMedium" style={[styles.formSubtitle, isDarkMode && styles.darkMutedText]}>
          Save calories and macros so your training and nutrition stay connected.
        </Text>

        <Card mode="elevated" style={[styles.formCard, isDarkMode && styles.darkCard]}>
          <Card.Content style={styles.formContent}>
            <TextInput
              label="Food name"
              mode="outlined"
              value={foodName}
              onChangeText={setFoodName}
              autoCapitalize="words"
            />
            <TextInput
              label="Calories"
              mode="outlined"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              right={<TextInput.Affix text="kcal" />}
            />

            <View style={styles.nutritionGrid}>
              <TextInput
                label="Protein"
                mode="outlined"
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
                right={<TextInput.Affix text="g" />}
                style={styles.nutritionField}
              />
              <TextInput
                label="Carbs"
                mode="outlined"
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
                right={<TextInput.Affix text="g" />}
                style={styles.nutritionField}
              />
            </View>

            <TextInput
              label="Fats"
              mode="outlined"
              value={fats}
              onChangeText={setFats}
              keyboardType="numeric"
              right={<TextInput.Affix text="g" />}
            />

            {message ? <Text style={styles.mealMessage}>{message}</Text> : null}

            <Button
              icon="content-save"
              mode="contained"
              loading={isSaving}
              disabled={isSaving}
              contentStyle={styles.buttonContent}
              style={styles.mealButton}
              onPress={saveMeal}>
              Save Meal
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function formatDate(value) {
  if (!value) {
    return 'Saved entry';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Saved entry';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function HistoryScreen() {
  const { isDarkMode } = useAppTheme();
  const [workouts, setWorkouts] = React.useState([]);
  const [meals, setMeals] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadHistory = React.useCallback(async () => {
    setIsLoading(true);

    try {
      const [storedWorkouts, storedMeals] = await Promise.all([
        AsyncStorage.getItem('workouts'),
        AsyncStorage.getItem('meals'),
      ]);

      const parsedWorkouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];
      const parsedMeals = storedMeals ? JSON.parse(storedMeals) : [];

      setWorkouts(Array.isArray(parsedWorkouts) ? parsedWorkouts.reverse() : []);
      setMeals(Array.isArray(parsedMeals) ? parsedMeals.reverse() : []);
    } catch (error) {
      setWorkouts([]);
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteHistoryItem = async (storageKey, id) => {
    try {
      const storedItems = await AsyncStorage.getItem(storageKey);
      const items = storedItems ? JSON.parse(storedItems) : [];
      const nextItems = Array.isArray(items) ? items.filter((item) => item.id !== id) : [];

      await AsyncStorage.setItem(storageKey, JSON.stringify(nextItems));
      loadHistory();
    } catch (error) {
      loadHistory();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const renderWorkoutCard = ({ item }) => (
    <Card mode="elevated" style={[styles.historyCard, isDarkMode && styles.darkCard]}>
      <Card.Content style={styles.historyCardContent}>
        <View style={styles.historyCardHeader}>
          <View style={styles.historyIconBadge}>
            <Text style={styles.historyIconText}>W</Text>
          </View>
          <View style={styles.historyTitleBlock}>
            <Text variant="titleMedium" style={[styles.historyCardTitle, isDarkMode && styles.darkTitle]}>
              {item.exerciseName || 'Workout'}
            </Text>
            <Text variant="bodySmall" style={[styles.historyDate, isDarkMode && styles.darkMutedText]}>
              {formatDate(item.createdAt)} {formatTime(item.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={[styles.metricPill, isDarkMode && styles.darkMetricPill]}>
            <Text style={[styles.metricValue, isDarkMode && styles.darkTitle]}>{item.sets || 0}</Text>
            <Text style={styles.metricLabel}>Sets</Text>
          </View>
          <View style={[styles.metricPill, isDarkMode && styles.darkMetricPill]}>
            <Text style={[styles.metricValue, isDarkMode && styles.darkTitle]}>{item.reps || 0}</Text>
            <Text style={styles.metricLabel}>Reps</Text>
          </View>
          <View style={[styles.metricPill, isDarkMode && styles.darkMetricPill]}>
            <Text style={[styles.metricValue, isDarkMode && styles.darkTitle]}>{item.weight || 0} kg</Text>
            <Text style={styles.metricLabel}>Weight</Text>
          </View>
        </View>

        <Button
          icon="delete-outline"
          mode="outlined"
          textColor="#dc2626"
          style={styles.deleteButton}
          contentStyle={styles.deleteButtonContent}
          onPress={() => deleteHistoryItem('workouts', item.id)}>
          Delete Log
        </Button>
      </Card.Content>
    </Card>
  );

  const renderMealCard = ({ item }) => (
    <Card mode="elevated" style={[styles.historyCard, isDarkMode && styles.darkCard]}>
      <Card.Content style={styles.historyCardContent}>
        <View style={styles.historyCardHeader}>
          <View style={[styles.historyIconBadge, styles.mealIconBadge]}>
            <Text style={styles.historyIconText}>M</Text>
          </View>
          <View style={styles.historyTitleBlock}>
            <Text variant="titleMedium" style={[styles.historyCardTitle, isDarkMode && styles.darkTitle]}>
              {item.foodName || 'Meal'}
            </Text>
            <Text variant="bodySmall" style={[styles.historyDate, isDarkMode && styles.darkMutedText]}>
              {formatDate(item.createdAt)} {formatTime(item.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={[styles.metricPill, isDarkMode && styles.darkMetricPill]}>
            <Text style={[styles.metricValue, isDarkMode && styles.darkTitle]}>{item.calories || 0}</Text>
            <Text style={styles.metricLabel}>Calories</Text>
          </View>
          <View style={[styles.metricPill, isDarkMode && styles.darkMetricPill]}>
            <Text style={[styles.metricValue, isDarkMode && styles.darkTitle]}>{item.protein || 0}g</Text>
            <Text style={styles.metricLabel}>Protein</Text>
          </View>
          <View style={[styles.metricPill, isDarkMode && styles.darkMetricPill]}>
            <Text style={[styles.metricValue, isDarkMode && styles.darkTitle]}>{item.carbs || 0}g</Text>
            <Text style={styles.metricLabel}>Carbs</Text>
          </View>
          <View style={[styles.metricPill, isDarkMode && styles.darkMetricPill]}>
            <Text style={[styles.metricValue, isDarkMode && styles.darkTitle]}>{item.fats || 0}g</Text>
            <Text style={styles.metricLabel}>Fats</Text>
          </View>
        </View>

        <Button
          icon="delete-outline"
          mode="outlined"
          textColor="#dc2626"
          style={styles.deleteButton}
          contentStyle={styles.deleteButtonContent}
          onPress={() => deleteHistoryItem('meals', item.id)}>
          Delete Log
        </Button>
      </Card.Content>
    </Card>
  );

  const historyRows = [
    { key: 'workouts-section', type: 'section', title: 'Workouts' },
    ...(workouts.length
      ? workouts.map((item, index) => ({
          key: item.id || `workout-${index}`,
          type: 'workout',
          item,
        }))
      : [
          {
            key: 'workouts-empty',
            type: 'empty',
            text: isLoading ? 'Loading workouts...' : 'No workouts saved yet.',
          },
        ]),
    { key: 'meals-section', type: 'section', title: 'Meals' },
    ...(meals.length
      ? meals.map((item, index) => ({
          key: item.id || `meal-${index}`,
          type: 'meal',
          item,
        }))
      : [
          {
            key: 'meals-empty',
            type: 'empty',
            text: isLoading ? 'Loading meals...' : 'No meals saved yet.',
          },
        ]),
  ];

  const renderHistoryRow = ({ item }) => {
    if (item.type === 'section') {
      return (
        <View style={styles.historySectionHeader}>
          <Text variant="titleLarge" style={[styles.sectionTitle, isDarkMode && styles.darkTitle]}>
            {item.title}
          </Text>
        </View>
      );
    }

    if (item.type === 'workout') {
      return renderWorkoutCard({ item: item.item });
    }

    if (item.type === 'meal') {
      return renderMealCard({ item: item.item });
    }

    return <Text style={[styles.emptyText, isDarkMode && styles.darkCard]}>{item.text}</Text>;
  };

  return (
    <FlatList
      style={[styles.screen, isDarkMode && styles.darkScreen]}
      contentContainerStyle={styles.historyContainer}
      data={historyRows}
      keyExtractor={(item) => item.key}
      renderItem={renderHistoryRow}
      ListHeaderComponent={
        <>
          <BrandHeader
            kicker="PROGRESS VAULT"
            title="HarshitStarkFitness"
            subtitle="Your saved training and nutrition history."
            compact
          />

          <View style={styles.historyHeader}>
            <Text variant="headlineMedium" style={[styles.historyTitle, isDarkMode && styles.darkTitle]}>
              History
            </Text>
            <Text variant="bodyMedium" style={[styles.historySubtitle, isDarkMode && styles.darkMutedText]}>
              Review your saved workouts and meals.
            </Text>
          </View>

          <View style={styles.historySummaryRow}>
            <Card mode="elevated" style={[styles.historySummaryCard, isDarkMode && styles.darkCard]}>
              <Card.Content>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {workouts.length}
                </Text>
                <Text variant="labelMedium" style={styles.statLabel}>
                  Workouts
                </Text>
              </Card.Content>
            </Card>
            <Card
              mode="elevated"
              style={[styles.historySummaryCard, styles.mealSummaryCard, isDarkMode && styles.darkCard]}>
              <Card.Content>
                <Text variant="headlineSmall" style={styles.mealStatValue}>
                  {meals.length}
                </Text>
                <Text variant="labelMedium" style={styles.statLabel}>
                  Meals
                </Text>
              </Card.Content>
            </Card>
          </View>
        </>
      }
    />
  );
}

function ContactScreen() {
  const { isDarkMode } = useAppTheme();

  const contactItems = [
    {
      label: 'Email',
      value: 'harshit.stark.in@gmail.com',
      icon: 'email-outline',
      onPress: () => Linking.openURL('mailto:harshit.stark.in@gmail.com'),
    },
    {
      label: 'Instagram',
      value: 'instagram.com/harshit.pr18',
      icon: 'instagram',
      onPress: () => Linking.openURL('https://instagram.com/harshit.pr18'),
    },
    {
      label: 'GitHub',
      value: 'github.com/Harshitprajapati10',
      icon: 'github',
      onPress: () => Linking.openURL('https://github.com/Harshitprajapati10'),
    },
  ];

  return (
    <ScrollView
      style={[styles.screen, isDarkMode && styles.darkScreen]}
      contentContainerStyle={styles.contactContainer}>
      <BrandHeader
        kicker="CONNECT"
        title="HarshitStarkFitness"
        subtitle="Reach out for support, feedback, or fitness app ideas."
        compact
      />

      <Card mode="elevated" style={[styles.contactCard, isDarkMode && styles.darkCard]}>
        <Card.Content style={styles.contactContent}>
          <Text variant="headlineSmall" style={[styles.formTitle, isDarkMode && styles.darkTitle]}>
            Contact Us
          </Text>
          <Text variant="bodyMedium" style={[styles.formSubtitle, isDarkMode && styles.darkMutedText]}>
            Use any of these channels to get in touch.
          </Text>

          {contactItems.map((item) => (
            <Button
              key={item.label}
              icon={item.icon}
              mode="outlined"
              contentStyle={styles.contactButtonContent}
              style={styles.contactButton}
              labelStyle={styles.contactButtonLabel}
              onPress={item.onPress}>
              {item.label}: {item.value}
            </Button>
          ))}
        </Card.Content>
      </Card>

      <Surface style={[styles.copyrightCard, isDarkMode && styles.darkCard]} elevation={2}>
        <Text variant="bodyMedium" style={[styles.copyrightText, isDarkMode && styles.darkMutedText]}>
          © 2026 HarshitStarkFitness
        </Text>
      </Surface>
    </ScrollView>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const appTheme = isDarkMode ? darkTheme : lightTheme;
  const navigationTheme = isDarkMode ? darkNavigationTheme : lightNavigationTheme;
  const themeContextValue = React.useMemo(
    () => ({
      isDarkMode,
      toggleTheme: () => setIsDarkMode((currentValue) => !currentValue),
    }),
    [isDarkMode]
  );

  return (
    <AppThemeContext.Provider value={themeContextValue}>
      <PaperProvider theme={appTheme}>
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerRight: () => <HeaderThemeSwitch />,
              headerStyle: { backgroundColor: isDarkMode ? '#111827' : '#f5f7fb' },
              headerShadowVisible: false,
              headerTitleStyle: { color: isDarkMode ? '#f8fafc' : '#111827', fontWeight: '800' },
            }}>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
            <Stack.Screen
              name="AddWorkout"
              component={AddWorkoutScreen}
              options={{ title: 'Add Workout' }}
            />
            <Stack.Screen name="AddMeal" component={AddMealScreen} options={{ title: 'Add Meal' }} />
            <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
            <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Us' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AppThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  darkScreen: {
    backgroundColor: '#0f172a',
  },
  headerSwitchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 4,
  },
  headerSwitchLabel: {
    color: '#475569',
    fontWeight: '800',
  },
  homeContent: {
    padding: 20,
    paddingBottom: 36,
    gap: 16,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 8,
    padding: 18,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#263244',
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
  },
  darkBrandHeader: {
    backgroundColor: '#020617',
    borderColor: '#334155',
  },
  compactBrandHeader: {
    padding: 16,
    marginBottom: 18,
  },
  logoStage: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoShadow: {
    position: 'absolute',
    width: 58,
    height: 16,
    bottom: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    transform: [{ scaleX: 1.1 }],
  },
  logoBadge: {
    backgroundColor: '#ef4444',
    borderWidth: 3,
    borderColor: '#fecaca',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  brandTextBlock: {
    flex: 1,
  },
  brandKicker: {
    color: '#67e8f9',
    fontWeight: '900',
    marginBottom: 4,
  },
  brandTitle: {
    color: '#ffffff',
    fontWeight: '900',
  },
  brandSubtitle: {
    color: '#cbd5e1',
    lineHeight: 20,
    marginTop: 6,
  },
  hero: {
    minHeight: 270,
    overflow: 'hidden',
    borderRadius: 8,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  heroImage: {
    borderRadius: 8,
  },
  heroOverlay: {
    minHeight: 270,
    justifyContent: 'flex-end',
    padding: 24,
    backgroundColor: 'rgba(8, 13, 24, 0.58)',
  },
  heroEyebrow: {
    color: '#67e8f9',
    fontWeight: '900',
    marginBottom: 8,
  },
  heroTitle: {
    color: '#ffffff',
    fontWeight: '900',
  },
  heroSubtitle: {
    color: '#e2e8f0',
    marginTop: 8,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderLeftWidth: 5,
    borderLeftColor: '#ef4444',
    shadowColor: '#334155',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  darkCard: {
    backgroundColor: '#1f2937',
    borderColor: '#334155',
  },
  mealStatCard: {
    borderLeftColor: '#14b8a6',
  },
  statContent: {
    paddingVertical: 18,
  },
  statValue: {
    color: '#ef4444',
    fontWeight: '900',
  },
  statLabel: {
    color: '#64748b',
    fontWeight: '800',
  },
  actionCard: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 6,
  },
  actionContent: {
    gap: 14,
    paddingVertical: 22,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    color: '#111827',
    fontWeight: '900',
  },
  darkTitle: {
    color: '#f8fafc',
  },
  darkMutedText: {
    color: '#cbd5e1',
  },
  statusChip: {
    backgroundColor: '#dcfce7',
  },
  statusChipText: {
    color: '#166534',
    fontWeight: '800',
  },
  buttonContent: {
    height: 50,
  },
  primaryButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 36,
  },
  formHero: {
    height: 160,
    overflow: 'hidden',
    borderRadius: 8,
    justifyContent: 'flex-end',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  formHeroImage: {
    borderRadius: 8,
  },
  formHeroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
    backgroundColor: 'rgba(10, 18, 32, 0.6)',
  },
  mealHeroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
    backgroundColor: 'rgba(15, 56, 44, 0.6)',
  },
  mealEyebrow: {
    color: '#99f6e4',
    fontWeight: '900',
    marginBottom: 8,
  },
  formHeroTitle: {
    color: '#ffffff',
    fontWeight: '900',
  },
  formTitle: {
    color: '#111827',
    fontWeight: '900',
    marginBottom: 8,
  },
  formSubtitle: {
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 21,
  },
  formCard: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 6,
  },
  formContent: {
    gap: 14,
    paddingVertical: 22,
  },
  formMessage: {
    color: '#ef4444',
    fontWeight: '800',
  },
  mealMessage: {
    color: '#0f766e',
    fontWeight: '800',
  },
  mealButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 8,
  },
  nutritionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  nutritionField: {
    flex: 1,
  },
  historyContainer: {
    padding: 20,
    paddingBottom: 36,
  },
  contactContainer: {
    padding: 20,
    paddingBottom: 36,
  },
  contactCard: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 6,
  },
  contactContent: {
    gap: 14,
    paddingVertical: 22,
  },
  contactButton: {
    alignItems: 'flex-start',
    borderRadius: 8,
    borderColor: '#cbd5e1',
  },
  contactButtonContent: {
    minHeight: 52,
    justifyContent: 'flex-start',
  },
  contactButtonLabel: {
    textAlign: 'left',
    fontWeight: '800',
  },
  copyrightCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  copyrightText: {
    color: '#64748b',
    fontWeight: '800',
  },
  historyHeader: {
    marginBottom: 18,
  },
  historyTitle: {
    color: '#111827',
    fontWeight: '900',
  },
  historySubtitle: {
    color: '#64748b',
    marginTop: 6,
  },
  historySummaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  historySummaryCard: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderLeftWidth: 5,
    borderLeftColor: '#ef4444',
    shadowColor: '#334155',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  mealSummaryCard: {
    borderLeftColor: '#14b8a6',
  },
  mealStatValue: {
    color: '#14b8a6',
    fontWeight: '900',
  },
  historySectionHeader: {
    marginBottom: 10,
    marginTop: 4,
  },
  historyCard: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  historyCardContent: {
    gap: 16,
    paddingVertical: 20,
  },
  historyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 4,
  },
  mealIconBadge: {
    backgroundColor: '#14b8a6',
    shadowColor: '#14b8a6',
  },
  historyIconText: {
    color: '#ffffff',
    fontWeight: '900',
  },
  historyTitleBlock: {
    flex: 1,
  },
  historyCardTitle: {
    color: '#111827',
    fontWeight: '900',
  },
  historyDate: {
    color: '#64748b',
    marginTop: 2,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricPill: {
    minWidth: 78,
    flexGrow: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  darkMetricPill: {
    backgroundColor: '#111827',
    borderColor: '#334155',
  },
  metricValue: {
    color: '#111827',
    fontWeight: '900',
  },
  metricLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    borderColor: '#fecaca',
    borderRadius: 8,
    backgroundColor: '#fff7f7',
  },
  deleteButtonContent: {
    height: 40,
  },
  emptyText: {
    color: '#64748b',
    marginBottom: 18,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  placeholderScreen: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    justifyContent: 'center',
    padding: 20,
  },
  placeholderCard: {
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  placeholderImage: {
    height: 170,
  },
  placeholderContent: {
    gap: 14,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});
