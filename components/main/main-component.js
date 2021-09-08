import React, { useState, useEffect } from 'react';
import capitalize from 'lodash/capitalize';
import { SECTIONS as SECTIONS_2020, sectionCategories } from '../../data/sections-2020';
import { SECTIONS } from '../../data/sections-2021';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import ReactGA from 'react-ga';

import styles from '../../styles/Home.module.scss';

const Radar = dynamic(() => import('../radar/radar'));
const createAnalyticsEvent = ({ category, action }) => ReactGA.event({
  category,
  action
});

export default function Main(props) {
  const { uniqueSkills, groupedSkillsBySkill, categorySkills, skillData, interestData, source } = props;
  const updatedSectionCategories = sectionCategories;
  const is2020 = source === '2020';
  if (!is2020) {
    Object.entries(SECTIONS).forEach(([section, categories]) => {
      updatedSectionCategories[section] = Object.keys(categories);
    });
  }

  useEffect(() => {
    ReactGA.initialize('G-11M6FDTLKM');
  }, []);

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
  const numberOfDevs = is2020 ? 11 : 10;
  const interestColors = {
    interested: 'lightgreen',
    'not interested': 'lightcoral',
  };

  const [selectedCategory, selectCategory] = useState(null);
  const [selectedSection, selectSection] = useState(null);
  const [selectedSkill, selectSkill] = useState(null);

  const getFilteredSkills = (skills, section, category) => {
    let filteredSkills = skills;
    if (section) {
      filteredSkills = skills.filter(
        (skill) => skill.category && updatedSectionCategories[skill.category.toLowerCase()] === section
      );
    }
    if (category) {
      filteredSkills = skills.filter((skill) => skill.category === category);
    }
    return filteredSkills;
  };

  const filteredSkills = getFilteredSkills(
    uniqueSkills,
    selectedSection,
    selectedCategory
  );

  const SkilledNames = ({ selectedSkill, value }) => {
    if (!selectedSkill || !groupedSkillsBySkill[selectedSkill]) return null;
    const valueSkills = groupedSkillsBySkill[selectedSkill].filter(
      (s) => s.value === value
    );
    if (!valueSkills) return null;
    return (
      <div className={styles.developerSkill}>
        <div className={styles.developerSkillTitle}>{capitalize(value)}</div>
        <div>
          {valueSkills.map((s) => (
            <div>{s.name}</div>
          ))}
        </div>
      </div>
    );
  };

  const renderCategories = () => {
    const sections = is2020 ? SECTIONS_2020 : SECTIONS;
    const getCategories = (section) => (is2020 ?
      Object.keys(categorySkills).filter((category) => updatedSectionCategories[category] === section) :
      Object.keys(sections[section])
    );
    return sections && Object.keys(sections).map((section) => (
      <div className={cx(styles.section, styles[section])}>
        <button
          className={cx(styles.sectionTitle, {
            [styles.blue]: section === selectedSection
          })}
          onClick={() => {
            createAnalyticsEvent({
              category: 'Section',
              action: section
            });
            selectSection(selectedSection === section ? null : section);
          }}
        >
          {section}
        </button>
        <div className={styles.categories}>
          {getCategories(section)
            .map((category) => (
              <button
                className={cx({
                  [styles.blue]: category === selectedCategory
                })}
                onClick={() => {
                  createAnalyticsEvent({
                    category: 'Category',
                    action: category
                  });
                  selectCategory(
                    selectedCategory === category ? null : category
                  );
                }}
              >
                {category}
              </button>
            ))}
        </div>
      </div>
    ));
  };

  return (
    <main>
      <div className={styles.sections}>
        {categorySkills && renderCategories()}
      </div>
      <Radar
        width={800}
        height={800}
        data={skillData}
        skills={filteredSkills}
        skillRanges={skillRanges}
        isUnfiltered={!selectedSection && !selectedCategory}
        colors={colors}
        domain={is2020 ? [0, numberOfDevs] : [0, 4]}
      />
      {!is2020 && (
        <Radar
          width={800}
          height={800}
          data={interestData}
          skills={filteredSkills}
          skillRanges={[
            'interested',
            'not interested'
          ]}
          isUnfiltered={!selectedSection && !selectedCategory}
          colors={interestColors}
          domain={[0, numberOfDevs]}
        />
      )}
      <div className={styles.skillSection}>
        <label for="skill" className={styles.skillLabel}>
          Choose a skill
        </label>
        <input
          list="skills"
          name="skill"
          id="skill"
          onChange={(v) => {
            const skill = v.target.value;
            if (uniqueSkills.map((s) => s.skill).includes(skill)) {
              createAnalyticsEvent({ category: 'Skill', action: skill });
            }
            selectSkill(skill);
          }}
        />
        <datalist id="skills">
          {uniqueSkills
            .map((s) => s.skill)
            .map((skill) => (
              <option value={skill} />
            ))}
        </datalist>
      </div>
      {!is2020 && (
        <details className={styles.legend}>
          <summary>Legend</summary>
          <div>
            0 🤷 I've never even heard of it or I'd be uncomfortable working with it!
          </div>
          <div>
            1 👬 I'd be comfortable,but would need support
          </div>
          <div>
            2 🐢 I'd be comfortable alone,but it would take more time
          </div>
          <div>
            3 🐎 I'd be comfortable alone
          </div>
          <div>
            4 🧙‍♀️ I would be able to explain every concept in detail and work in very advanced features
          </div>
        </details>
      )}
      <div className={styles.skillNames}>
        {skillTableRanges.map(skillRange =>  <SkilledNames key={skillRange} selectedSkill={selectedSkill} value={skillRange} />)}
      </div>
    </main>
  );
}