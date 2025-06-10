import type { User, Unit, Word, StudentProgress, OfflineGrade, PersonalizedTest } from './types';
import { Home, Users, Utensils, Palette, School, Building, Cloud, CalendarDays, Gamepad2, Smile } from 'lucide-react';

export const users: User[] = [
  { id: 'teacher-vlad', username: 'Vladislav', password: 'Vladislav15', name: 'Ermilov Vladislav', role: 'teacher' },
  { id: 'student-oksana', username: 'Oksana', password: 'Oksana25', name: 'Yurchenko Oksana', role: 'student' },
  { id: 'student-alex', username: 'Alexander', password: 'Alexander23', name: 'Ermilov Alexander', role: 'student' },
];

const createWords = (wordsArray: Array<[string, string, string]>): Word[] => {
  return wordsArray.map(([english, russian, phonetic], index) => ({
    id: `${english.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    english,
    russian,
    phonetic,
  }));
};

export const units: Unit[] = [
  {
    id: 'unit-1',
    name: 'Unit 1: Greetings',
    icon: Smile,
    rounds: [
      {
        id: 'unit-1-round-1',
        name: 'Round 1',
        words: createWords([
          ['hi', 'привет', 'хай'],
          ['hello', 'здравствуйте', 'хэллоу'],
          ['goodbye', 'до свидания', 'гудбай'],
          ['good morning', 'доброе утро', 'гуд морнинг'],
          ['good night', 'доброй ночи', 'гуд найт'],
        ]),
      },
      {
        id: 'unit-1-round-2',
        name: 'Round 2',
        words: createWords([
          ['how are you', 'как дела?', 'хау ар ю'],
          ['I’m fine', 'у меня все хорошо', 'айм файн'],
          ['nice to meet you', 'приятно познакомиться', 'найс ту мит ю'],
          ['see you', 'увидимся', 'си ю'],
          ['take care', 'береги себя', 'тэйк кэр'],
        ]),
      },
    ],
  },
  {
    id: 'unit-2',
    name: 'Unit 2: Family',
    icon: Users,
    rounds: [
      {
        id: 'unit-2-round-1',
        name: 'Round 1',
        words: createWords([
          ['mother', 'мама', 'мазэр'],
          ['father', 'папа', 'фазэр'],
          ['sister', 'сестра', 'систэр'],
          ['brother', 'брат', 'бразэр'],
          ['parents', 'родители', 'пэрэнтс'],
        ]),
      },
      {
        id: 'unit-2-round-2',
        name: 'Round 2',
        words: createWords([
          ['grandmother', 'бабушка', 'грэндмазэр'],
          ['grandfather', 'дедушка', 'грэндфазэр'],
          ['uncle', 'дядя', 'анкл'],
          ['aunt', 'тетя', 'ант'],
          ['cousin', 'двоюродный брат/сестра', 'казн'],
        ]),
      },
    ],
  },
  {
    id: 'unit-3',
    name: 'Unit 3: Food',
    icon: Utensils,
    rounds: [
      {
        id: 'unit-3-round-1',
        name: 'Round 1',
        words: createWords([
          ['bread', 'хлеб', 'брэд'],
          ['milk', 'молоко', 'милк'],
          ['water', 'вода', 'уотэр'],
          ['juice', 'сок', 'джус'],
          ['apple', 'яблоко', 'эпл'],
        ]),
      },
      {
        id: 'unit-3-round-2',
        name: 'Round 2',
        words: createWords([
          ['tea', 'чай', 'ти'],
          ['coffee', 'кофе', 'кофи'],
          ['orange', 'апельсин', 'ориндж'],
          ['banana', 'банан', 'бэнана'],
          ['salad', 'салат', 'сэлэд'],
        ]),
      },
    ],
  },
  {
    id: 'unit-4',
    name: 'Unit 4: Numbers',
    icon: Home, // Using Home as a placeholder, ideally a number-related icon
    rounds: [
      {
        id: 'unit-4-round-1',
        name: 'Round 1',
        words: createWords([
          ['one', 'один', 'уан'],
          ['two', 'два', 'ту'],
          ['three', 'три', 'сри'],
          ['four', 'четыре', 'фор'],
          ['five', 'пять', 'файв'],
        ]),
      },
      {
        id: 'unit-4-round-2',
        name: 'Round 2',
        words: createWords([
          ['six', 'шесть', 'сикс'],
          ['seven', 'семь', 'сэвэн'],
          ['eight', 'восемь', 'эйт'],
          ['nine', 'девять', 'найн'],
          ['ten', 'десять', 'тэн'],
        ]),
      },
    ],
  },
  {
    id: 'unit-5',
    name: 'Unit 5: Colors',
    icon: Palette,
    rounds: [
      {
        id: 'unit-5-round-1',
        name: 'Round 1',
        words: createWords([
          ['red', 'красный', 'рэд'],
          ['blue', 'синий', 'блу'],
          ['green', 'зеленый', 'грин'],
          ['yellow', 'желтый', 'йеллоу'],
          ['black', 'черный', 'блэк'],
        ]),
      },
      {
        id: 'unit-5-round-2',
        name: 'Round 2',
        words: createWords([
          ['white', 'белый', 'уайт'],
          ['brown', 'коричневый', 'браун'],
          ['orange', 'оранжевый', 'ориндж (колор)'],
          ['pink', 'розовый', 'пинк'],
          ['purple', 'фиолетовый', 'пёрпл'],
        ]),
      },
    ],
  },
  {
    id: 'unit-6',
    name: 'Unit 6: School',
    icon: School,
    rounds: [
      {
        id: 'unit-6-round-1',
        name: 'Round 1',
        words: createWords([
          ['school', 'школа', 'скул'],
          ['classroom', 'класс', 'класрум'],
          ['teacher', 'учитель', 'тичэр'],
          ['student', 'ученик', 'стьюдэнт'],
          ['lesson', 'урок', 'лэсн'],
        ]),
      },
      {
        id: 'unit-6-round-2',
        name: 'Round 2',
        words: createWords([
          ['book', 'книга', 'бук'],
          ['pen', 'ручка', 'пэн'],
          ['pencil', 'карандаш', 'пэнсил'],
          ['desk', 'парта', 'дэск'],
          ['chair', 'стул', 'чэар'],
        ]),
      },
    ],
  },
  {
    id: 'unit-7',
    name: 'Unit 7: House',
    icon: Building,
    rounds: [
      {
        id: 'unit-7-round-1',
        name: 'Round 1',
        words: createWords([
          ['house', 'дом', 'хаус'],
          ['room', 'комната', 'рум'],
          ['kitchen', 'кухня', 'китчэн'],
          ['bedroom', 'спальня', 'бэдрум'],
          ['bathroom', 'ванная', 'басрум'],
        ]),
      },
      {
        id: 'unit-7-round-2',
        name: 'Round 2',
        words: createWords([
          ['window', 'окно', 'уиндоу'],
          ['door', 'дверь', 'дор'],
          ['table', 'стол', 'тэйбл'],
          ['bed', 'кровать', 'бэд'],
          ['chair', 'стул', 'чэар (хаус)'],
        ]),
      },
    ],
  },
  {
    id: 'unit-8',
    name: 'Unit 8: Weather',
    icon: Cloud,
    rounds: [
      {
        id: 'unit-8-round-1',
        name: 'Round 1',
        words: createWords([
          ['sunny', 'солнечно', 'сани'],
          ['rainy', 'дождливо', 'рэйни'],
          ['windy', 'ветрено', 'уинди'],
          ['cloudy', 'облачно', 'клауди'],
          ['snowy', 'снежно', 'сноуи'],
        ]),
      },
      {
        id: 'unit-8-round-2',
        name: 'Round 2',
        words: createWords([
          ['hot', 'жарко', 'хот'],
          ['cold', 'холодно', 'колд'],
          ['warm', 'тепло', 'уорм'],
          ['cool', 'прохладно', 'кул'],
          ['stormy', 'штормовой', 'сторми'],
        ]),
      },
    ],
  },
  {
    id: 'unit-9',
    name: 'Unit 9: Days of the Week',
    icon: CalendarDays,
    rounds: [
      {
        id: 'unit-9-round-1',
        name: 'Round 1',
        words: createWords([
          ['Monday', 'понедельник', 'мандэй'],
          ['Tuesday', 'вторник', 'тьюздэй'],
          ['Wednesday', 'среда', 'уэнздэй'],
          ['Thursday', 'четверг', 'сёрздэй'],
          ['Friday', 'пятница', 'фрайдэй'],
        ]),
      },
      {
        id: 'unit-9-round-2',
        name: 'Round 2',
        words: createWords([
          ['Saturday', 'суббота', 'сэтэрдэй'],
          ['Sunday', 'воскресенье', 'сандэй'],
          ['today', 'сегодня', 'тудэй'],
          ['tomorrow', 'завтра', 'тумороу'],
          ['yesterday', 'вчера', 'йестэдэй'],
        ]),
      },
    ],
  },
  {
    id: 'unit-10',
    name: 'Unit 10: Hobbies',
    icon: Gamepad2,
    rounds: [
      {
        id: 'unit-10-round-1',
        name: 'Round 1',
        words: createWords([
          ['reading', 'чтение', 'ридинг'],
          ['playing', 'игра', 'плэинг'],
          ['drawing', 'рисование', 'дроинг'],
          ['swimming', 'плавание', 'суиминг'],
          ['singing', 'пение', 'сингинг'],
        ]),
      },
      {
        id: 'unit-10-round-2',
        name: 'Round 2',
        words: createWords([
          ['dancing', 'танцы', 'дэнсинг'],
          ['cooking', 'готовка', 'кукинг'],
          ['running', 'бег', 'ранинг'],
          ['traveling', 'путешествия', 'трэвэлинг'],
          ['watching TV', 'просмотр ТВ', 'уотчинг тиви'],
        ]),
      },
    ],
  },
];

// Initial empty data for progress and grades, to be populated by interactions
export let studentProgressData: StudentProgress[] = [];
export let offlineGradesData: OfflineGrade[] = [];
export let personalizedTestsData: PersonalizedTest[] = [];
