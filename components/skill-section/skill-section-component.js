import React from 'react';
import capitalize from 'lodash/capitalize';
import styles from '../../styles/Home.module.scss';

const SkilledNames = ({ selectedSkill, value, groupedSkillsBySkill }) => {
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

export default function SkillSection({ selectedSkill, selectSkill, uniqueSkills, is2020, skillTableRanges, groupedSkillsBySkill }) {
  return (
    <>
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
        {skillTableRanges.map(skillRange =>  <SkilledNames key={skillRange} selectedSkill={selectedSkill} value={skillRange} groupedSkillsBySkill={groupedSkillsBySkill} />)}
    </div>
    </>
  )
}
