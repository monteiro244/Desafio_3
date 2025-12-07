import { View, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { TextInput, Button, Card, Text } from 'react-native-paper';

const API = 'https://scaling-tribble-pjpr77j65q6x36w7g-3333.app.github.dev';

export default function App() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [lista, setLista] = useState<any[]>([]);

  async function carregar() {
    try {
      const res = await fetch(API + '/items');
      const data = await res.json();
      setLista(data || []);
    } catch (error) {
      console.error('Erro ao carregar:', error);
    }
  }

  async function salvar() {
    try {
      await fetch(API + '/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descricao })
      });
      setTitulo('');
      setDescricao('');
      carregar();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  }

  async function deletar(id: string) {
    try {
      await fetch(API + '/items/' + id, { method: 'DELETE' });
      carregar();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  }

  useEffect(() => { carregar(); }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text variant="titleLarge">CRUD Expo + MongoDB</Text>

      <TextInput label="Título" value={titulo} onChangeText={setTitulo} />
      <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} />

      <Button onPress={salvar}>Salvar</Button>

      <FlatList
        data={lista}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <Card style={{ marginTop: 10, padding: 10 }}>
            <Text>{item.titulo}</Text>
            <Text>{item.descricao}</Text>
            <Button onPress={() => deletar(item._id)}>Excluir</Button>
          </Card>
        )}
      />
    </View>
  );
}
