-- Sample content currently shown on the prototype.
-- These entries are placeholders to be replaced with real articles and photos.
-- Run after neon-schema.sql.

begin;

insert into articles (section, title_en, desc_en, title_si, desc_si, published, sort_order) values
  ('education', 'Inquiry-based learning in the science classroom', 'How questions, not answers, can lead students to understand science more deeply.', 'විද්‍යා පන්තිකාමරයේ විමර්ශන පාදක ඉගෙනීම', 'පිළිතුරු නොව ප්‍රශ්න, සිසුන් විද්‍යාව ගැඹුරින් අවබෝධ කර ගැනීමට මඟ පාදන ආකාරය.', true, 1),
  ('education', 'Making practical work meaningful', 'Simple ways to turn school experiments into real learning experiences.', 'ප්‍රායෝගික ක්‍රියාකාරකම් අර්ථවත් කිරීම', 'පාසල් පරීක්ෂණ සැබෑ ඉගෙනුම් අත්දැකීම් බවට පත් කිරීමට සරල ක්‍රම.', true, 2),
  ('education', 'Assessing scientific thinking, not just recall', 'Ideas for questions that show how students reason, not only what they remember.', 'මතකය පමණක් නොව විද්‍යාත්මක චින්තනය ඇගයීම', 'සිසුන් මතක තබා ගන්නා දේ පමණක් නොව, ඔවුන් තර්ක කරන ආකාරය පෙන්වන ප්‍රශ්න සඳහා අදහස්.', true, 3),
  ('education', 'Teaching chemistry with everyday materials', 'Low-cost activities using things found at home and in the market.', 'එදිනෙදා ද්‍රව්‍ය භාවිතයෙන් රසායන විද්‍යාව ඉගැන්වීම', 'නිවසේ සහ වෙළඳපොළේ ඇති දේ භාවිත කරන අඩු වියදම් ක්‍රියාකාරකම්.', true, 4),
  ('education', 'Supporting new science teachers', 'Guidance for the first years in the classroom.', 'නව විද්‍යා ගුරුවරුන්ට සහාය වීම', 'පන්තිකාමරයේ මුල් වසර සඳහා මඟපෙන්වීම.', true, 5),
  ('education', 'From syllabus to lesson plan', 'A step-by-step approach to planning a complete science unit.', 'විෂය නිර්දේශයේ සිට පාඩම් සැලැස්ම දක්වා', 'සම්පූර්ණ විද්‍යා ඒකකයක් සැලසුම් කිරීමට පියවරෙන් පියවර ප්‍රවේශයක්.', true, 6),
  ('general', 'Notes on science curriculum reform', 'Reflections on how curricula change, and what helps the change reach classrooms.', 'විද්‍යා විෂයමාලා ප්‍රතිසංස්කරණ පිළිබඳ සටහන්', 'විෂයමාලා වෙනස් වන ආකාරය සහ එම වෙනස පන්තිකාමරයට ළඟා වීමට උපකාරී වන දේ පිළිබඳ ආවර්ජන.', true, 1),
  ('general', 'What examination results can tell us', 'Reading national results to understand learning, not only to rank schools.', 'විභාග ප්‍රතිඵල අපට පවසන දේ', 'පාසල් ශ්‍රේණිගත කිරීමට පමණක් නොව, ඉගෙනීම තේරුම් ගැනීමට ජාතික ප්‍රතිඵල කියවීම.', true, 2),
  ('general', 'Quality assurance in schools', 'Lessons from the field on supporting schools to improve.', 'පාසල්වල ගුණාත්මකභාවය තහවුරු කිරීම', 'පාසල් දියුණු කිරීමට සහාය වීම පිළිබඳ ක්ෂේත්‍රයෙන් ලත් පාඩම්.', true, 3),
  ('general', 'Teacher development as a lifelong process', 'Why professional growth works best when it continues throughout a career.', 'ජීවිත කාලය පුරා ගුරු සංවර්ධනය', 'වෘත්තීය වර්ධනය සේවා කාලය පුරා අඛණ්ඩව පවතින විට වඩාත් සාර්ථක වන්නේ ඇයි.', true, 4),
  ('general', 'Reading research: a guide for teachers', 'How busy teachers can find, read and use educational research.', 'පර්යේෂණ කියවීම: ගුරුවරුන් සඳහා මඟපෙන්වීමක්', 'කාර්යබහුල ගුරුවරුන්ට අධ්‍යාපන පර්යේෂණ සොයා, කියවා, භාවිත කළ හැකි ආකාරය.', true, 5),
  ('general', 'Language and understanding in science', 'The role of everyday and scientific language in how students learn.', 'විද්‍යාවේ භාෂාව සහ අවබෝධය', 'සිසුන් ඉගෙන ගන්නා ආකාරයට එදිනෙදා සහ විද්‍යාත්මක භාෂාවේ බලපෑම.', true, 6),
  ('kids', 'The little seed that wanted to see the sky', 'A gentle story about how plants grow, for readers aged 5 to 8.', 'අහස දකින්නට ආශා කළ පුංචි බීජය', 'ශාක වැඩෙන ආකාරය ගැන මෘදු කතාවක්, වයස 5 සිට 8 දක්වා පාඨකයින් සඳහා.', true, 1),
  ('kids', 'Why does the moon change its shape?', 'A bedtime story that explains the phases of the moon.', 'හඳ හැඩය වෙනස් කරන්නේ ඇයි?', 'සඳෙහි කලා පැහැදිලි කරන නින්දට පෙර කතාවක්.', true, 2),
  ('kids', 'Raindrop’s long journey', 'Follow a single raindrop all the way around the water cycle.', 'වැහි බිංදුවේ දිගු ගමන', 'ජල චක්‍රය වටා එක් වැහි බිංදුවක් අනුගමනය කරන්න.', true, 3),
  ('kids', 'A day with the busy bees', 'Discover how bees help flowers, fruit and farmers.', 'කාර්යබහුල මී මැස්සන් සමඟ දවසක්', 'මී මැස්සන් මල්, පලතුරු සහ ගොවීන්ට උපකාර කරන ආකාරය සොයා ගන්න.', true, 4),
  ('kids', 'The star counter', 'A curious child tries to count the stars and learns about the night sky.', 'තරු ගණන් කරන්නා', 'තරු ගණන් කිරීමට තැත් කරන කුතුහලයෙන් පිරුණු දරුවෙක් රාත්‍රී අහස ගැන ඉගෙන ගනී.', true, 5),
  ('kids', 'Where does the river go?', 'A journey from the mountains all the way to the sea.', 'ගඟ ගලා යන්නේ කොහේද?', 'කඳුකරයේ සිට මුහුද දක්වා ගමනක්.', true, 6);

insert into albums (id, title_en, desc_en, title_si, desc_si, sort_order) values
  ('recent', 'Recent moments', 'Photos from everyday life these days.', 'මෑත සටහන්', 'මේ දිනවල එදිනෙදා ජීවිතයේ ඡායාරූප.', 1),
  ('new-things', 'New things I’m doing', 'Fresh projects, ideas and new experiences.', 'මා අලුතින් කරන දේ', 'නව ව්‍යාපෘති, අදහස් සහ නව අත්දැකීම්.', 2),
  ('outings', 'Trips and outings', 'Travels, visits and days out.', 'සංචාර සහ විනෝද ගමන්', 'ගමන්, සංචාර සහ එළිමහන් දින.', 3),
  ('leisure', 'Leisure and hobbies', 'The activities I enjoy in my free time.', 'විවේකය සහ විනෝදාංශ', 'විවේක කාලයේ මා රස විඳින ක්‍රියාකාරකම්.', 4),
  ('portraits', 'Portraits', 'Recent personal photographs, including the portrait on the home page.', 'පෞද්ගලික ඡායාරූප', 'මුල් පිටුවේ ඇති ඡායාරූපය ද ඇතුළුව මෑත පෞද්ගලික ඡායාරූප.', 5)
on conflict (id) do nothing;

-- The portrait from the home page; change the URL to where assets/portrait.jpg is hosted.
insert into photos (album_id, image_url, caption_en, caption_si, ratio, sort_order) values
  ('portraits', '/portrait.jpg', 'Portrait in the garden', 'උද්‍යානයේ දී ගත් ඡායාරූපය', 1, 1);

commit;
