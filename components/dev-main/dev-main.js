import { createElement } from 'react';
import MainComponent from './dev-main-component';
import data2020 from '../../data/data-2020.json';
import data2021 from '../../data/data-2021.json';
import groupBy from 'lodash/groupBy';
import trim from 'lodash/trim';
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';
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
  const { source, dev } = props;
  const is2020 = source.meta.year === '2020';
  const data = is2020 ? data2020 : data2021;

  const totalSkills = [];
  const interestSkills = [];
  const allSkills = [];
  const developers = [];
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
        developers.push(d['Your name']);

        value.forEach((v) => {
          if (v && skill && d['Your name'] === dev) {
            totalSkills.push({
              category,
              skill,
              value: v
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
          developers.push(d['Your name']);

          if (type === 'Rating' && d['Your name'] === dev) {
            totalSkills.push({
              category,
              skill,
              value
            });
          } else if (type === 'Interest' && d['Your name'] === dev) {
            interestSkills.push({
              category,
              skill,
              value
            });
          }
        });
    });

    const groupValuesBySkill = groupBy(totalSkills, 'skill');
    const groupInterestValuesBySkill = groupBy(interestSkills, 'skill');
    const values = { name: 'competency' };

    const interestedValues = { name: 'interested' };
    const notInterestedValues = { name: 'not interested' };

    Object.keys(groupValuesBySkill).forEach(skill => {
      values[skill] = groupValuesBySkill[skill][0].value;
    });

    Object.keys(groupInterestValuesBySkill).forEach(skill => {
      interestedValues[skill] = groupInterestValuesBySkill[skill].some(s => s.value === 'Learning');
      notInterestedValues[skill] = groupInterestValuesBySkill[skill].some(s => s.value === 'No');
    });
    skillData = [values];
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
    categorySkills,
    developers: uniq(developers)
  };

  const skillRanges = is2020 ?
    ['expert',
    'competent',
    'basic knowledge',
    'no knowledge',
    'learning',
    'want to learn',
    'not interested'] :
    ['competency'];

  const colors = is2020 ? {
    learning: '#F49F0A',
    'want to learn': '#EFCA08',
    'not interested': 'lightcoral',
    expert: '#11403F',
    competent: '#2BA4A0',
    'basic knowledge': '#CFF2F2',
    'no knowledge': '#ddd'
  } : {
    'competency': '#2BA4A0',
  };
  const interestColors = {
    interested: 'lightgreen',
    'not interested': 'lightcoral',
  };

  const config = {
    skillRanges,
    colors,
    interestColors,
  };

  return createElement(MainComponent, { ...dataProps, ...props, is2020, config });
}

export default MainContainer;
