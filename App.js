import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const ORANGE = '#EF6837';
const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'Vegetarian', 'Seafood', 'Chicken', 'Pasta', 'Salads', 'Soups', 'Snacks', 'My Food'];
const PHOTO = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
const SEED = [
  ['Avocado Toast', 'Breakfast', 'photo-1525351484163-7529414344d8', 10, 2, 285, 'Easy', ['2 slices whole-grain bread', '1 ripe avocado', '1 lemon', 'Salt and pepper', 'Chili flakes'], ['Toast the bread until golden.', 'Mash avocado with lemon, salt, and pepper.', 'Spread on toast and sprinkle with chili flakes.']],
  ['Berry Pancakes', 'Breakfast', 'photo-1528207776546-365bb710ee93', 25, 4, 340, 'Easy', ['1 cup flour', '1 egg', '1 cup milk', '1 tsp baking powder', '1 cup mixed berries'], ['Mix flour and baking powder.', 'Whisk in egg and milk.', 'Cook pancakes in a greased skillet and top with berries.']],
  ['Mediterranean Bowl', 'Lunch', 'photo-1512621776951-a57141f2eefd', 20, 2, 410, 'Easy', ['2 cups cooked quinoa', '1 cucumber', '1 cup cherry tomatoes', '1/2 cup feta', '2 tbsp olive oil'], ['Chop cucumber and tomatoes.', 'Divide quinoa into bowls.', 'Add vegetables and feta, then drizzle with olive oil.']],
  ['Grilled Chicken Plate', 'Chicken', 'photo-1532550907401-a500c9a57435', 35, 3, 430, 'Medium', ['3 chicken breasts', '2 tbsp olive oil', '1 tsp paprika', '2 cloves garlic', 'Salt'], ['Season chicken with oil, paprika, garlic, and salt.', 'Grill 6–8 minutes per side until fully cooked.', 'Rest 5 minutes and serve.']],
  ['Creamy Tomato Pasta', 'Pasta', 'photo-1473093295043-cdd812d0e601', 30, 4, 520, 'Easy', ['12 oz pasta', '2 cups tomato sauce', '1/2 cup cream', '2 cloves garlic', 'Fresh basil'], ['Boil pasta according to package directions.', 'Simmer garlic, tomato sauce, and cream.', 'Toss pasta with sauce and garnish with basil.']],
  ['Salmon and Greens', 'Seafood', 'photo-1467003909585-2f8a72700288', 30, 2, 460, 'Medium', ['2 salmon fillets', '2 cups spinach', '1 lemon', '1 tbsp olive oil', 'Salt and pepper'], ['Season salmon and sear skin-side down.', 'Flip and cook until the fish flakes.', 'Serve with sautéed spinach and lemon.']],
  ['Garden Salad', 'Salads', 'photo-1512621776951-a57141f2eefd', 15, 2, 190, 'Easy', ['2 cups mixed greens', '1 tomato', '1 cucumber', '1 carrot', '2 tbsp vinaigrette'], ['Wash and dry greens.', 'Slice vegetables.', 'Toss with dressing just before serving.']],
  ['Vegetable Soup', 'Soups', 'photo-1547592180-85f173990554', 40, 6, 220, 'Easy', ['1 onion', '2 carrots', '2 celery stalks', '4 cups broth', '1 can diced tomatoes'], ['Dice all vegetables.', 'Sauté onion, carrot, and celery.', 'Add broth and tomatoes; simmer for 25 minutes.']],
  ['Chocolate Brownies', 'Dessert', 'photo-1606313564200-e75d5e30476c', 45, 9, 310, 'Medium', ['1/2 cup butter', '1 cup sugar', '2 eggs', '1/3 cup cocoa', '1/2 cup flour'], ['Preheat oven to 350°F (175°C).', 'Mix melted butter, sugar, eggs, cocoa, and flour.', 'Bake in a lined pan for 25–30 minutes.']],
  ['Chickpea Curry', 'Vegan', 'photo-1603894584373-5ac82b2ae398', 35, 4, 380, 'Easy', ['2 cans chickpeas', '1 can coconut milk', '2 tbsp curry paste', '1 onion', '2 cups spinach'], ['Sauté chopped onion and curry paste.', 'Add chickpeas and coconut milk; simmer 20 minutes.', 'Stir in spinach until wilted.']],
  ['Caprese Sandwich', 'Vegetarian', 'photo-1528735602780-2552fd46c7af', 15, 2, 360, 'Easy', ['2 ciabatta rolls', '1 tomato', '4 oz mozzarella', 'Fresh basil', '1 tbsp pesto'], ['Slice bread and spread with pesto.', 'Layer tomatoes, mozzarella, and basil.', 'Close sandwiches and serve.']],
  ['Trail Mix Cups', 'Snacks', 'photo-1599599810769-bcde5a160d32', 5, 4, 210, 'Easy', ['1 cup almonds', '1/2 cup dried cranberries', '1/2 cup pumpkin seeds', '1/4 cup dark chocolate chips'], ['Mix all ingredients.', 'Divide evenly into four snack portions.']],
  ['Lemon Herb Chicken', 'Dinner', 'photo-1532550907401-a500c9a57435', 45, 4, 480, 'Medium', ['4 chicken thighs', '1 lemon', '2 tbsp olive oil', '1 tsp oregano', '3 cloves garlic'], ['Heat oven to 400°F (200°C).', 'Coat chicken with lemon, oil, oregano, and garlic.', 'Roast until chicken reaches 165°F (74°C).']]
].map(([name, category, photo, minutes, servings, calories, difficulty, ingredients, instructions], i) => ({ id: `seed-${i}`, name, category, image: PHOTO(photo), minutes, servings, calories, difficulty, ingredients, instructions, mine: false }));

const emptyForm = () => ({ name: '', image: '', category: 'Dinner', ingredients: '', instructions: '', minutes: '30', servings: '2', calories: '350', difficulty: 'Easy' });
const parseLines = (s) => s.split('\n').map(x => x.trim()).filter(Boolean);
const Field = ({ label, field, form, setForm, multiline, placeholder, keyboardType }) => <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput style={[styles.input, multiline && styles.multiline]} value={form[field]} onChangeText={value => setForm(old => ({ ...old, [field]: value }))} placeholder={placeholder} multiline={multiline} keyboardType={keyboardType} textAlignVertical={multiline ? 'top' : 'center'} /></View>;

export default function App() {
  const [screen, setScreen] = useState('home');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [mine, setMine] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [savedMine, savedFavorites] = await Promise.all([AsyncStorage.getItem('foodie:mine'), AsyncStorage.getItem('foodie:favorites')]);
        if (savedMine) setMine(JSON.parse(savedMine));
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      } catch (e) { console.warn('Could not load saved recipes', e); }
      finally { setReady(true); }
    })();
  }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem('foodie:mine', JSON.stringify(mine)).catch(console.warn); }, [mine, ready]);
  useEffect(() => { if (ready) AsyncStorage.setItem('foodie:favorites', JSON.stringify(favorites)).catch(console.warn); }, [favorites, ready]);

  const recipes = [...mine, ...SEED];
  const goBack = () => {
    if (screen === 'details') setScreen(selected?.mine ? 'myRecipes' : 'home');
    else if (screen === 'form') setScreen('myRecipes');
    else setScreen('home');
  };
  const openRecipe = (recipe) => { setSelected(recipe); setScreen('details'); };
  const toggleFavorite = (id) => setFavorites(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  const openNew = () => { setForm(emptyForm()); setEditingId(null); setScreen('form'); };
  const openEdit = (recipe) => {
    setForm({ ...recipe, ingredients: recipe.ingredients.join('\n'), instructions: recipe.instructions.join('\n'), minutes: String(recipe.minutes), servings: String(recipe.servings), calories: String(recipe.calories) });
    setEditingId(recipe.id); setScreen('form');
  };
  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted && Platform.OS !== 'web') { Alert.alert('Photo permission required', 'Allow access to photos in device settings.'); return; }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, base64: true });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        // Persist the small image across restarts; a temporary picker URI may expire.
        setForm(f => ({ ...f, image: asset.base64 ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}` : asset.uri }));
      }
    } catch (e) { Alert.alert('Image unavailable', 'You can use an image URL instead.'); }
  };
  const saveRecipe = () => {
    const name = form.name.trim();
    const ingredients = parseLines(form.ingredients);
    const instructions = parseLines(form.instructions);
    if (!name || ingredients.length === 0 || instructions.length === 0) { Alert.alert('Missing information', 'Enter a recipe name, at least one ingredient, and at least one instruction.'); return; }
    const recipe = { id: editingId || `mine-${Date.now()}`, name, category: form.category, image: form.image.trim() || PHOTO('1547592180-85f173990554'), ingredients, instructions, minutes: Number(form.minutes) || 0, servings: Number(form.servings) || 1, calories: Number(form.calories) || 0, difficulty: form.difficulty, mine: true };
    setMine(old => editingId ? old.map(r => r.id === editingId ? recipe : r) : [recipe, ...old]);
    setSelected(recipe); setScreen('myRecipes');
  };
  const deleteRecipe = (recipe) => {
    const perform = () => { setMine(old => old.filter(r => r.id !== recipe.id)); setFavorites(old => old.filter(id => id !== recipe.id)); setScreen('myRecipes'); };
    if (Platform.OS === 'web') { if (typeof window !== 'undefined' && window.confirm(`Delete ${recipe.name}?`)) perform(); }
    else Alert.alert('Delete recipe?', `Remove ${recipe.name} from My Recipes?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: perform }]);
  };

  const Button = ({ label, onPress, secondary, danger, small }) => <TouchableOpacity accessibilityRole="button" onPress={onPress} style={[styles.button, secondary && styles.secondaryButton, danger && styles.dangerButton, small && styles.smallButton]}><Text style={[styles.buttonText, secondary && styles.secondaryText, danger && styles.dangerText]}>{label}</Text></TouchableOpacity>;
  const RecipeCard = ({ recipe }) => <TouchableOpacity accessibilityRole="button" onPress={() => openRecipe(recipe)} style={styles.card}>
    <Image source={{ uri: recipe.image }} style={styles.cardImage} />
    <View style={styles.cardBody}><Text style={styles.cardCategory}>{recipe.category.toUpperCase()}</Text><Text style={styles.cardTitle} numberOfLines={2}>{recipe.name}</Text><Text style={styles.meta}>⏱ {recipe.minutes} min   ·   {recipe.difficulty}</Text></View>
    <TouchableOpacity accessibilityLabel={favorites.includes(recipe.id) ? 'Remove favorite' : 'Add favorite'} onPress={() => toggleFavorite(recipe.id)} style={styles.heart}><Text style={styles.heartText}>{favorites.includes(recipe.id) ? '♥' : '♡'}</Text></TouchableOpacity>
  </TouchableOpacity>;
  const Tab = ({ label, value }) => <TouchableOpacity accessibilityRole="button" onPress={() => { setCategory(value); setSearch(''); setScreen(value === 'My Food' ? 'myRecipes' : 'home'); }} style={[styles.chip, category === value && screen === 'home' && styles.activeChip]}><Text style={[styles.chipText, category === value && screen === 'home' && styles.activeChipText]}>{label}</Text></TouchableOpacity>;

  return <SafeAreaView style={styles.safe}><StatusBar barStyle="dark-content" /><View style={styles.shell}>
    <View style={styles.header}><TouchableOpacity onPress={screen === 'home' ? () => { setCategory('All'); setSearch(''); } : goBack}><Text style={styles.back}>{screen === 'home' ? '🍴' : '‹ Back'}</Text></TouchableOpacity><Text style={styles.logo}>foodie<Text style={{ color: ORANGE }}>.</Text></Text><TouchableOpacity onPress={() => setScreen('favorites')}><Text style={styles.headerHeart}>♥ <Text style={styles.count}>{favorites.length}</Text></Text></TouchableOpacity></View>
    {screen === 'home' && <><View style={styles.hero}><Text style={styles.eyebrow}>YOUR DAILY RECIPE INSPIRATION</Text><Text style={styles.heroTitle}>What sounds good{ '\n' }today? 🍳</Text><TextInput value={search} onChangeText={setSearch} placeholder="🔎  Search delicious recipes..." style={styles.search} /></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>{CATEGORIES.map(c => <Tab key={c} label={c} value={c} />)}</ScrollView><ScrollView contentContainerStyle={styles.content}><Text style={styles.sectionTitle}>{category === 'All' ? 'Explore recipes' : category + ' recipes'} <Text style={styles.resultCount}>({recipes.filter(r => (category === 'All' || r.category === category) && r.name.toLowerCase().includes(search.toLowerCase())).length})</Text></Text><View style={styles.grid}>{recipes.filter(r => (category === 'All' || r.category === category) && r.name.toLowerCase().includes(search.toLowerCase())).map(r => <RecipeCard key={r.id} recipe={r} />)}</View></ScrollView></>}
    {screen === 'details' && selected && <ScrollView contentContainerStyle={styles.content}><Image source={{ uri: selected.image }} style={styles.detailImage} /><View style={styles.detailTop}><Text style={styles.detailTitle}>{selected.name}</Text><TouchableOpacity accessibilityLabel="Toggle favorite" onPress={() => toggleFavorite(selected.id)}><Text style={styles.detailHeart}>{favorites.includes(selected.id) ? '♥' : '♡'}</Text></TouchableOpacity></View><Text style={styles.categoryPill}>{selected.category}</Text><View style={styles.stats}>{[['⏱', `${selected.minutes} min`, 'Prep time'], ['🍽', `${selected.servings}`, 'Servings'], ['🔥', `${selected.calories}`, 'Calories'], ['⭐', selected.difficulty, 'Difficulty']].map(([icon, val, label]) => <View style={styles.stat} key={label}><Text style={styles.statIcon}>{icon}</Text><Text style={styles.statValue}>{val}</Text><Text style={styles.statLabel}>{label}</Text></View>)}</View><Text style={styles.sectionTitle}>Ingredients</Text>{selected.ingredients.map((x, i) => <Text key={i} style={styles.line}>✓  {x}</Text>)}<Text style={[styles.sectionTitle, { marginTop: 24 }]}>Instructions</Text>{selected.instructions.map((x, i) => <View key={i} style={styles.step}><Text style={styles.stepIndex}>{i + 1}</Text><Text style={styles.stepText}>{x}</Text></View>)}{selected.mine && <View style={styles.actions}><Button label="Edit Recipe" onPress={() => openEdit(selected)} /><Button label="Delete" danger onPress={() => deleteRecipe(selected)} /></View>}</ScrollView>}
    {screen === 'favorites' && <ScrollView contentContainerStyle={styles.content}><Text style={styles.pageTitle}>❤️ Your Favorites</Text><Text style={styles.subhead}>Recipes worth making again.</Text><View style={styles.grid}>{recipes.filter(r => favorites.includes(r.id)).map(r => <RecipeCard key={r.id} recipe={r} />)}</View>{favorites.filter(id => recipes.some(r => r.id === id)).length === 0 && <Text style={styles.empty}>No favorites yet. Tap ♡ on any recipe to save it here.</Text>}</ScrollView>}
    {screen === 'myRecipes' && <ScrollView contentContainerStyle={styles.content}><Text style={styles.pageTitle}>👩‍🍳 My Food</Text><Text style={styles.subhead}>Your very own recipe collection.</Text><Button label="＋ Add New Recipe" onPress={openNew} /><Text style={[styles.sectionTitle, { marginTop: 26 }]}>My Recipes ({mine.length})</Text>{mine.length === 0 && <Text style={styles.empty}>Your cookbook is waiting. Add your first recipe!</Text>}{mine.map(r => <View key={r.id} style={styles.mineRow}><TouchableOpacity style={styles.mineMain} onPress={() => openRecipe(r)}><Image source={{ uri: r.image }} style={styles.mineImage} /><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{r.name}</Text><Text style={styles.meta}>{r.category} · {r.minutes} min</Text><Text style={styles.viewDetails}>View full recipe →</Text></View></TouchableOpacity><View style={styles.actions}><Button label="Edit" small secondary onPress={() => openEdit(r)} /><Button label="Delete" small danger onPress={() => deleteRecipe(r)} /></View></View>)}</ScrollView>}
    {screen === 'form' && <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}><Text style={styles.pageTitle}>{editingId ? 'Edit Recipe' : 'Add New Recipe'}</Text><Text style={styles.subhead}>Make something wonderful and save it to My Recipes.</Text><Field form={form} setForm={setForm} label="Recipe name *" field="name" placeholder="e.g. Grandma's apple pie" /><View style={styles.field}><Text style={styles.fieldLabel}>Recipe image</Text><Button label="📷 Upload Image" onPress={pickImage} secondary />{form.image ? <Image source={{ uri: form.image }} style={styles.uploadPreview} /> : null}<TextInput placeholder="Or paste an image URL (optional)" style={[styles.input, { marginTop: 10 }]} value={form.image.startsWith('data:') ? '' : form.image} onChangeText={image => setForm(f => ({ ...f, image }))} /></View><View style={styles.field}><Text style={styles.fieldLabel}>Category</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{CATEGORIES.filter(c => c !== 'All' && c !== 'My Food').map(c => <TouchableOpacity key={c} onPress={() => setForm(f => ({ ...f, category: c }))} style={[styles.chip, form.category === c && styles.activeChip]}><Text style={[styles.chipText, form.category === c && styles.activeChipText]}>{c}</Text></TouchableOpacity>)}</ScrollView></View><Field form={form} setForm={setForm} label="Ingredients * (one per line)" field="ingredients" placeholder={'2 cups flour\n1 tsp salt\n1 cup milk'} multiline /><Field form={form} setForm={setForm} label="Step-by-step instructions * (one step per line)" field="instructions" placeholder={'Preheat the oven.\nMix the ingredients.\nBake until golden.'} multiline /><View style={styles.fieldRow}><View style={{ flex: 1 }}><Field form={form} setForm={setForm} label="Prep time (min)" field="minutes" keyboardType="numeric" /></View><View style={{ flex: 1 }}><Field form={form} setForm={setForm} label="Servings" field="servings" keyboardType="numeric" /></View></View><View style={styles.fieldRow}><View style={{ flex: 1 }}><Field form={form} setForm={setForm} label="Calories" field="calories" keyboardType="numeric" /></View><View style={{ flex: 1 }}><Text style={styles.fieldLabel}>Difficulty</Text>{['Easy', 'Medium', 'Hard'].map(d => <TouchableOpacity key={d} onPress={() => setForm(f => ({ ...f, difficulty: d }))}><Text style={[styles.difficultyOption, form.difficulty === d && { color: ORANGE, fontWeight: '800' }]}>{form.difficulty === d ? '●' : '○'} {d}</Text></TouchableOpacity>)}</View></View><Button label={editingId ? 'Save Changes' : 'Save Recipe'} onPress={saveRecipe} /><View style={{ height: 30 }} /></ScrollView></KeyboardAvoidingView>}
    <View style={styles.tabBar}><TouchableOpacity onPress={() => { setCategory('All'); setScreen('home'); }}><Text style={styles.tabText}>{screen === 'home' ? '🏠' : '⌂'}{"\n"}Explore</Text></TouchableOpacity><TouchableOpacity onPress={() => setScreen('favorites')}><Text style={styles.tabText}>♥{"\n"}Favorites</Text></TouchableOpacity><TouchableOpacity onPress={() => setScreen('myRecipes')}><Text style={styles.tabText}>📖{"\n"}My Food</Text></TouchableOpacity></View>
  </View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF9F5', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }, shell: { flex: 1, width: '100%', maxWidth: 820, alignSelf: 'center', backgroundColor: '#FFFDFC' },
  header: { height: 64, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#F4E8E0' }, logo: { fontSize: 29, fontWeight: '900', color: '#2E2927', letterSpacing: -1.5 }, back: { color: ORANGE, fontSize: 19, fontWeight: '800' }, headerHeart: { fontSize: 22, color: ORANGE }, count: { fontSize: 13, color: '#777' },
  hero: { backgroundColor: '#FFF0E6', paddingHorizontal: 24, paddingTop: 26, paddingBottom: 24 }, eyebrow: { fontSize: 10, letterSpacing: 1.6, fontWeight: '800', color: ORANGE }, heroTitle: { marginTop: 10, marginBottom: 20, fontSize: 31, lineHeight: 38, fontWeight: '900', color: '#302A26' }, search: { backgroundColor: '#fff', borderRadius: 15, padding: 15, fontSize: 15, color: '#333' },
  categories: { paddingHorizontal: 16, paddingVertical: 14, gap: 8, maxHeight: 66 }, chip: { backgroundColor: '#F6F1ED', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 10, marginRight: 6, alignSelf: 'center' }, activeChip: { backgroundColor: ORANGE }, chipText: { fontSize: 13, color: '#61554F', fontWeight: '700' }, activeChipText: { color: 'white' },
  content: { padding: 20, paddingBottom: 32 }, sectionTitle: { fontSize: 22, fontWeight: '900', color: '#302A26', marginBottom: 16 }, resultCount: { fontSize: 14, color: '#999' }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', flexGrow: 1, flexBasis: '45%', maxWidth: '49%', borderRadius: 17, backgroundColor: 'white', overflow: 'hidden', borderWidth: 1, borderColor: '#F2EBE6', marginBottom: 4 }, cardImage: { height: 128, width: '100%', backgroundColor: '#F8DCC9' }, cardBody: { padding: 12 }, cardCategory: { fontSize: 9, color: ORANGE, fontWeight: '900', letterSpacing: 1 }, cardTitle: { fontSize: 15, color: '#302A26', fontWeight: '800', marginTop: 5, marginBottom: 6 }, meta: { fontSize: 11, color: '#847A74' }, heart: { position: 'absolute', right: 9, top: 8, backgroundColor: 'white', width: 35, height: 35, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }, heartText: { color: ORANGE, fontSize: 28, lineHeight: 31 },
  detailImage: { height: 240, borderRadius: 18, backgroundColor: '#F8DCC9' }, detailTop: { marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, detailTitle: { flex: 1, fontSize: 28, fontWeight: '900', color: '#302A26' }, detailHeart: { color: ORANGE, fontSize: 34 }, categoryPill: { alignSelf: 'flex-start', color: ORANGE, backgroundColor: '#FFF0E6', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18, marginVertical: 12, fontWeight: '700' }, stats: { flexDirection: 'row', backgroundColor: '#FFF4EC', borderRadius: 16, padding: 16, marginBottom: 26, justifyContent: 'space-around' }, stat: { alignItems: 'center', flex: 1 }, statIcon: { fontSize: 20 }, statValue: { marginTop: 7, fontWeight: '900', color: '#2E2927', fontSize: 13 }, statLabel: { fontSize: 10, color: '#887A70', marginTop: 4 }, line: { color: '#4F4540', fontSize: 15, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#F4ECE6' }, step: { flexDirection: 'row', gap: 14, marginBottom: 15, alignItems: 'flex-start' }, stepIndex: { color: 'white', fontWeight: '900', backgroundColor: ORANGE, borderRadius: 18, overflow: 'hidden', textAlign: 'center', width: 30, height: 30, lineHeight: 30 }, stepText: { flex: 1, fontSize: 15, lineHeight: 23, color: '#50443D' },
  pageTitle: { fontSize: 28, fontWeight: '900', color: '#302A26' }, subhead: { fontSize: 14, color: '#887A70', marginTop: 6, marginBottom: 24 }, empty: { textAlign: 'center', padding: 35, color: '#857871', fontSize: 15, lineHeight: 24 },
  button: { backgroundColor: ORANGE, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', marginVertical: 5 }, buttonText: { color: 'white', fontWeight: '800', fontSize: 14 }, secondaryButton: { backgroundColor: '#FFF0E6', borderWidth: 1, borderColor: '#F8D5C3' }, secondaryText: { color: ORANGE }, dangerButton: { backgroundColor: '#FFECEB' }, dangerText: { color: '#BA3636' }, smallButton: { paddingHorizontal: 17, paddingVertical: 10 }, actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  mineRow: { backgroundColor: 'white', borderWidth: 1, borderColor: '#F2EBE6', borderRadius: 15, padding: 12, marginBottom: 12 }, mineMain: { flexDirection: 'row', gap: 15, alignItems: 'center' }, mineImage: { width: 85, height: 85, borderRadius: 10, backgroundColor: '#F8DCC9' }, viewDetails: { color: ORANGE, fontWeight: '700', marginTop: 8 },
  field: { marginBottom: 18 }, fieldLabel: { fontSize: 14, fontWeight: '800', color: '#493D36', marginBottom: 8 }, input: { borderWidth: 1, borderColor: '#E6DCD5', borderRadius: 12, padding: 13, fontSize: 15, backgroundColor: 'white', color: '#302A26' }, multiline: { minHeight: 110 }, uploadPreview: { width: '100%', height: 155, borderRadius: 12, marginTop: 10 }, fieldRow: { flexDirection: 'row', gap: 15 }, difficultyOption: { paddingVertical: 3, color: '#665D58' },
  tabBar: { minHeight: 64, paddingTop: 10, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#F2E9E3' }, tabText: { textAlign: 'center', fontWeight: '700', fontSize: 12, lineHeight: 20, color: '#655A53' }
});
