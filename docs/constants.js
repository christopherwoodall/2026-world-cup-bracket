const fixedSeeds = {
    'm0-t1': { id: 's1', name: 'South Africa', flag: '🇿🇦' },
    'm0-t2': { id: 's2', name: 'Canada', flag: '🇨🇦' },
    'm1-t1': { id: 's3', name: 'Brazil', flag: '🇧🇷' },
    'm1-t2': { id: 's4', name: 'Japan', flag: '🇯🇵' },
    'm2-t1': { id: 's5', name: 'Germany', flag: '🇩🇪' },
    'm3-t1': { id: 's6', name: 'Netherlands', flag: '🇳🇱' },
    'm3-t2': { id: 's7', name: 'Morocco', flag: '🇲🇦' },
    'm4-t1': { id: 's8', name: 'Ivory Coast', flag: '🇨🇮' },
    'm6-t1': { id: 's9', name: 'Mexico', flag: '🇲🇽' },
    'm9-t1': { id: 's10', name: 'USA', flag: '🇺🇸' },
    'm9-t2': { id: 's11', name: 'Bosnia & Herz.', flag: '🇧🇦' },
    'm12-t1': { id: 's12', name: 'Switzerland', flag: '🇨🇭' },
    'm13-t1': { id: 's13', name: 'Australia', flag: '🇦🇺' },
    'm14-t1': { id: 's14', name: 'Argentina', flag: '🇦🇷' }
};

const dynamicTeams = [
    { id: 'd1', name: 'Sweden', flag: '🇸🇪', type: 'unseeded' },
    { id: 'd2', name: 'Ecuador', flag: '🇪🇨', type: 'unseeded' },
    { id: 'd3', name: 'Colombia', flag: '🇨🇴', type: 'unseeded' },
    { id: 'd4', name: 'France', flag: '🇫🇷', type: 'group' },
    { id: 'd5', name: 'Norway', flag: '🇳🇴', type: 'group' },
    { id: 'd6', name: 'Senegal', flag: '🇸🇳', type: 'group' },
    { id: 'd7', name: 'Iraq', flag: '🇮🇶', type: 'group' },
    { id: 'd8', name: 'Cabo Verde', flag: '🇨🇻', type: 'group' },
    { id: 'd9', name: 'Saudi Arabia', flag: '🇸🇦', type: 'group' },
    { id: 'd10', name: 'Uruguay', flag: '🇺🇾', type: 'group' },
    { id: 'd11', name: 'Spain', flag: '🇪🇸', type: 'group' },
    { id: 'd12', name: 'New Zealand', flag: '🇳🇿', type: 'group' },
    { id: 'd13', name: 'Belgium', flag: '🇧🇪', type: 'group' },
    { id: 'd14', name: 'Egypt', flag: '🇪🇬', type: 'group' },
    { id: 'd15', name: 'Iran', flag: '🇮🇷', type: 'group' },
    { id: 'd16', name: 'Panama', flag: '🇵🇦', type: 'group' },
    { id: 'd17', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', type: 'group' },
    { id: 'd18', name: 'Croatia', flag: '🇭🇷', type: 'group' },
    { id: 'd19', name: 'Ghana', flag: '🇬🇭', type: 'group' }
];

const groupMatches = [
    { id: 'g1', group: 'Grp I (Jun 26)', t1Id: 'd5', t2Id: 'd4' },
    { id: 'g2', group: 'Grp I (Jun 26)', t1Id: 'd6', t2Id: 'd7' },
    { id: 'g3', group: 'Grp H (Jun 26)', t1Id: 'd8', t2Id: 'd9' },
    { id: 'g4', group: 'Grp H (Jun 26)', t1Id: 'd10', t2Id: 'd11' },
    { id: 'g5', group: 'Grp G (Jun 26)', t1Id: 'd12', t2Id: 'd13' },
    { id: 'g6', group: 'Grp G (Jun 26)', t1Id: 'd14', t2Id: 'd15' },
    { id: 'g7', group: 'Grp L (Jun 27)', t1Id: 'd16', t2Id: 'd17' },
    { id: 'g8', group: 'Grp L (Jun 27)', t1Id: 'd18', t2Id: 'd19' }
];

// Bind variables to window so they are visible to Babel standalone script execution
window.fixedSeeds = fixedSeeds;
window.dynamicTeams = dynamicTeams;
window.groupMatches = groupMatches;
