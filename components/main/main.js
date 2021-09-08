import { createElement } from 'react';
import MainComponent from './main-component';
import data2020 from '../../data/data-2020.json';
import data2021 from '../../data/data-2021.json';
import metadata2020 from '../../data/metadata-2020';
import metadata2021 from '../../data/metadata-2021';
import groupBy from 'lodash/groupBy';
import trim from 'lodash/trim';
import uniqBy from 'lodash/uniqBy';
import { SECTIONS } from '../../data/sections-2021';

const skillCategories = {};
Object.values(SECTIONS).map((section) => {
  Object.entries(section).forEach(([cat, skills]) => {
    skills.forEach((skill) => {
      skillCategories[skill.replace(/ /g,'')] = cat;
    })
  });
});

function MainContainer(props) {
  const { source } = props;
  const is2020 = source.meta.year === '2020';
  const data = is2020 ? data2020 : data2021;

  const totalSkills = [];
  const interestSkills = [];
  const allSkills = [];
  let skillData = [];
  let interestData = [];

  if (is2020) {
    data.forEach((d) => {
      const regex = /(.+)\[(.+)]/;
      const parseText = (text) => trim(text.toLowerCase());
      Object.keys(d).forEach((currentKey) => {
        const match = currentKey.match(regex);
        const category = match && parseText(match[1]);
        let skill = match && parseText(match[2]);
        if (!skill) return;
        const value = d[currentKey].split(',').map(parseText);
        const existingSkills = allSkills.filter((s) => s.skill === skill);
        const isSameSkillDifferentCategory =
          existingSkills.length &&
          !existingSkills.find((s) => s.category === category);
        if (isSameSkillDifferentCategory) {
          skill = `${skill} (${category})`;
        }

        allSkills.push({ skill, category });

        value.forEach((v) => {
          if (v && skill) {
            totalSkills.push({
              category,
              skill,
              value: v,
              name: d['Your name']
            });
          }
        });
      });
    });

    const groupedSkills = groupBy(totalSkills, 'value');
    Object.keys(groupedSkills).forEach((skill) => {
      const valueGrouped = groupBy(groupedSkills[skill], 'skill');
      const valueGroupedNumber = {};
      Object.keys(valueGrouped).forEach((key) => {
        valueGroupedNumber[key] = valueGrouped[key].length;
      });
      skillData.push({
        name: skill,
        ...valueGroupedNumber
      });
    });
  } else {
      data.forEach((d) => {
        Object.keys(d).forEach((currentKey) => {
          const match = currentKey.split(' | ');
          if (!match) return;
          const [skill, type] = match && match;
          if (['Dirección de correo electrónico', 'Timestamp', 'Your name'].includes(skill)) return;
          const value = d[currentKey];
          const category = skillCategories[skill.replace(/ /g,'')];
          allSkills.push({ skill, category });

          if (type === 'Rating') {
            totalSkills.push({
              category,
              skill,
              value,
              name: d['Your name']
            });
          } else if (type === 'Interest') {
            interestSkills.push({
              category,
              skill,
              value,
              name: d['Your name']
            });
          }
        });
    });

    const groupValuesBySkill = groupBy(totalSkills, 'skill');
    const groupInterestValuesBySkill = groupBy(interestSkills, 'skill');
    const maxValues = { name: 'max' };
    const meanValues = { name: 'mean' };
    const minValues = { name: 'min' };

    const interestedValues = { name: 'interested' };
    const notInterestedValues = { name: 'not interested' };

    Object.keys(groupValuesBySkill).forEach(skill => {
      maxValues[skill] = Math.max(...groupValuesBySkill[skill].map(s => s.value));
      minValues[skill] = Math.min(...groupValuesBySkill[skill].map(s => s.value));
      meanValues[skill] = groupValuesBySkill[skill].map(s => s.value).reduce((a, b) => a + b, 0) / groupValuesBySkill[skill].length;
    });

    Object.keys(groupInterestValuesBySkill).forEach(skill => {
      interestedValues[skill] = groupInterestValuesBySkill[skill].filter(s => s.value === 'Learning').length;
      notInterestedValues[skill] = groupInterestValuesBySkill[skill].filter(s => s.value === 'No').length;
    });

    skillData = [maxValues, meanValues, minValues];
    interestData = [interestedValues, notInterestedValues];
  }
  const uniqueSkills = uniqBy(allSkills, (v) => [v.skill, v.category].join());
  const categorySkills = groupBy(uniqueSkills, 'category');
  const groupedSkillsBySkill = groupBy(totalSkills, 'skill');

  const dataProps = {
    skillData,
    interestData,
    uniqueSkills,
    groupedSkillsBySkill,
    categorySkills
  };

  const skillRanges = is2020 ?
    ['expert',
    'competent',
    'basic knowledge',
    'no knowledge',
    'learning',
    'want to learn',
    'not interested'] :
    ['max', 'mean', 'min'];

  const skillTableRanges = is2020 ? skillRanges : [4, 3, 2, 1, 0];

  const colors = is2020 ? {
    learning: '#F49F0A',
    'want to learn': '#EFCA08',
    'not interested': 'lightcoral',
    expert: '#11403F',
    competent: '#2BA4A0',
    'basic knowledge': '#CFF2F2',
    'no knowledge': '#ddd'
  } : {
    'max': '#2BA4A0',
    'mean': '#F49F0A',
    'min': '#eee'
  };
  const numberOfDevs = is2020 ? metadata2020.devNumber : metadata2021.devNumber;
  const interestColors = {
    interested: 'lightgreen',
    'not interested': 'lightcoral',
  };

  const config = {
    skillRanges,
    skillTableRanges,
    colors,
    interestColors,
    numberOfDevs
  };
  return createElement(MainComponent, { ...dataProps, ...props, is2020, config });
}

export default MainContainer;
