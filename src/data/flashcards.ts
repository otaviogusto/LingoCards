export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  extraInfo?: string;
}

export interface Level {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
}

export const levels: Record<string, Level> = {
  beginner: {
    id: 'beginner',
    title: 'Beginner',
    description: 'Basic vocabulary and simple phrases.',
    cards: [
      { id: 'b1', question: 'Hello', answer: 'Olá / Ciao / Bonjour', extraInfo: 'A common greeting.' },
      { id: 'b2', question: 'Thank you', answer: 'Obrigado / Grazie / Merci', extraInfo: 'Used to express gratitude.' },
      { id: 'b3', question: 'Water', answer: 'Água / Acqua / Eau', extraInfo: 'A transparent, tasteless liquid.' },
      { id: 'b4', question: 'Food', answer: 'Comida / Cibo / Nourriture', extraInfo: 'Any nutritious substance that people eat.' },
      { id: 'b5', question: 'Good morning', answer: 'Bom dia / Buongiorno / Bonjour', extraInfo: 'Greeting used in the morning.' },
      { id: 'b6', question: 'Cat', answer: 'Gato / Gatto / Chat', extraInfo: 'A small domesticated carnivorous mammal.' },
      { id: 'b7', question: 'Dog', answer: 'Cachorro / Cane / Chien', extraInfo: 'A domesticated carnivorous mammal.' },
      { id: 'b8', question: 'House', answer: 'Casa / Casa / Maison', extraInfo: 'A building for human habitation.' },
      { id: 'b9', question: 'Car', answer: 'Carro / Auto / Voiture', extraInfo: 'A four-wheeled road vehicle.' },
      { id: 'b10', question: 'Book', answer: 'Livro / Libro / Livre', extraInfo: 'A written or printed work.' },
    ]
  },
  intermediate: {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Everyday conversations and common idioms.',
    cards: [
      { id: 'i1', question: 'To understand', answer: 'Entender / Capire / Comprendre', extraInfo: 'Perceive the intended meaning of.' },
      { id: 'i2', question: 'Although', answer: 'Embora / Sebbene / Bien que', extraInfo: 'In spite of the fact that.' },
      { id: 'i3', question: 'Environment', answer: 'Meio ambiente / Ambiente / Environnement', extraInfo: 'The surroundings or conditions in which a person lives.' },
      { id: 'i4', question: 'To develop', answer: 'Desenvolver / Sviluppare / Développer', extraInfo: 'Grow or cause to grow and become more mature.' },
      { id: 'i5', question: 'Knowledge', answer: 'Conhecimento / Conoscenza / Connaissance', extraInfo: 'Facts, information, and skills acquired through experience.' },
      { id: 'i6', question: 'To achieve', answer: 'Alcançar / Raggiungere / Atteindre', extraInfo: 'Successfully bring about or reach a desired objective.' },
      { id: 'i7', question: 'Challenge', answer: 'Desafio / Sfida / Défi', extraInfo: 'A task or situation that tests someone\'s abilities.' },
      { id: 'i8', question: 'Opportunity', answer: 'Oportunidade / Opportunità / Opportunité', extraInfo: 'A set of circumstances that makes it possible to do something.' },
      { id: 'i9', question: 'To improve', answer: 'Melhorar / Migliorare / Améliorer', extraInfo: 'Make or become better.' },
      { id: 'i10', question: 'Experience', answer: 'Experiência / Esperienza / Expérience', extraInfo: 'Practical contact with and observation of facts or events.' },
    ]
  },
  advanced: {
    id: 'advanced',
    title: 'Advanced',
    description: 'Complex vocabulary, phrasal verbs, and nuances.',
    cards: [
      { id: 'a1', question: 'Ubiquitous', answer: 'Onipresente / Onnipresente / Omniprésent', extraInfo: 'Present, appearing, or found everywhere.' },
      { id: 'a2', question: 'To mitigate', answer: 'Mitigar / Mitigare / Atténuer', extraInfo: 'Make less severe, serious, or painful.' },
      { id: 'a3', question: 'Paradigm', answer: 'Paradigma / Paradigma / Paradigme', extraInfo: 'A typical example or pattern of something; a model.' },
      { id: 'a4', question: 'Ephemeral', answer: 'Efêmero / Effimero / Éphémère', extraInfo: 'Lasting for a very short time.' },
      { id: 'a5', question: 'To exacerbate', answer: 'Exacerbar / Esacerbare / Exacerber', extraInfo: 'Make a problem, bad situation, or negative feeling worse.' },
      { id: 'a6', question: 'Pragmatic', answer: 'Pragmático / Pragmatico / Pragmatique', extraInfo: 'Dealing with things sensibly and realistically.' },
      { id: 'a7', question: 'To scrutinize', answer: 'Escrutinar / Scrutare / Scruter', extraInfo: 'Examine or inspect closely and thoroughly.' },
      { id: 'a8', question: 'Ambiguous', answer: 'Ambíguo / Ambiguo / Ambigu', extraInfo: 'Open to more than one interpretation; having a double meaning.' },
      { id: 'a9', question: 'To foster', answer: 'Fomentar / Promuovere / Favoriser', extraInfo: 'Encourage or promote the development of.' },
      { id: 'a10', question: 'Resilient', answer: 'Resiliente / Resiliente / Résilient', extraInfo: 'Able to withstand or recover quickly from difficult conditions.' },
    ]
  }
};
