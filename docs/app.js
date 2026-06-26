const { useState, useEffect, useRef } = React;

const generateInitialRounds = () => {
    let rounds = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    const r32Dates = [
        'Jun 28 - LA', 'Jun 29 - Houston', 'Jun 29 - Boston', 'Jun 29 - Monterrey',
        'Jun 30 - Dallas', 'Jun 30 - NY/NJ', 'Jun 30 - Mex City', 'Jul 1 - Atlanta',
        'Jul 1 - Seattle', 'Jul 1 - SF Bay', 'Jul 2 - LA', 'Jul 2 - Toronto',
        'Jul 2 - Vancouver', 'Jul 3 - Dallas', 'Jul 3 - Miami', 'Jul 3 - Kansas City'
    ];

    for (let i = 0; i < 16; i++) {
        rounds[0].push({
            matchId: `r0-m${i}`,
            team1: window.fixedSeeds[`m${i}-t1`] || null,
            team2: window.fixedSeeds[`m${i}-t2`] || null,
            winner: null,
            date: r32Dates[i]
        });
    }

    [8, 4, 2, 1].forEach((matchCount, index) => {
        const roundIndex = index + 1;
        for (let i = 0; i < matchCount; i++) {
            rounds[roundIndex].push({
                matchId: `r${roundIndex}-m${i}`,
                team1: null, team2: null, winner: null, date: 'TBD'
            });
        }
    });
    return rounds;
};

const App = () => {
    const [rounds, setRounds] = useState(generateInitialRounds());
    const [isExporting, setIsExporting] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const exportRef = useRef(null);

    // Mathematical constant for perfect alignment
    const BASE_SLOT_HEIGHT = 140;
    const COLUMN_GAP = 48; // Tailwind gap-12 = 48px
    const BRACKET_WIDTH = 260; // Fixed width of a match card

    const getPlacedTeamIds = () => {
        const ids = new Set();
        rounds[0].forEach(m => {
            if (m.team1 && m.team1.id.startsWith('d')) ids.add(m.team1.id);
            if (m.team2 && m.team2.id.startsWith('d')) ids.add(m.team2.id);
        });
        return ids;
    };
    const placedIds = getPlacedTeamIds();

    const placeTeamInBracket = (team) => {
        if (placedIds.has(team.id)) return;
        const newRounds = { ...rounds };
        for (let i = 0; i < 16; i++) {
            if (!newRounds[0][i].team1) { newRounds[0][i].team1 = team; break; }
            if (!newRounds[0][i].team2) { newRounds[0][i].team2 = team; break; }
        }
        setRounds(newRounds);
    };

    const removeTeamFromBracket = (matchIndex, isTeam1) => {
        const newRounds = { ...rounds };
        if (isTeam1) newRounds[0][matchIndex].team1 = null;
        else newRounds[0][matchIndex].team2 = null;
        cascadeClear(newRounds, 0, matchIndex);
        setRounds(newRounds);
    };

    const advanceTeam = (roundIndex, matchIndex, selectedTeam) => {
        if (!selectedTeam) return;
        const newRounds = { ...rounds };
        newRounds[roundIndex][matchIndex].winner = selectedTeam;

        if (roundIndex < 4) {
            const nextRound = roundIndex + 1;
            const nextMatchIndex = Math.floor(matchIndex / 2);
            const isTeam1 = matchIndex % 2 === 0;

            if (isTeam1) newRounds[nextRound][nextMatchIndex].team1 = selectedTeam;
            else newRounds[nextRound][nextMatchIndex].team2 = selectedTeam;

            cascadeClear(newRounds, nextRound, nextMatchIndex);
        }
        setRounds(newRounds);
    };

    const cascadeClear = (currentRounds, startRound, startMatchIndex) => {
        const startMatch = currentRounds[startRound][startMatchIndex];
        if (startMatch.winner) {
            const wId = startMatch.winner.id;
            const t1Id = startMatch.team1 ? startMatch.team1.id : null;
            const t2Id = startMatch.team2 ? startMatch.team2.id : null;
            if (wId !== t1Id && wId !== t2Id) {
                startMatch.winner = null;
            }
        }

        let currMatchIdx = startMatchIndex;
        for (let currRound = startRound; currRound <= 3; currRound++) {
            const nextRound = currRound + 1;
            const nextMatchIdx = Math.floor(currMatchIdx / 2);
            const currentMatch = currentRounds[currRound][currMatchIdx];
            const nextMatch = currentRounds[nextRound][nextMatchIdx];

            const isTeam1 = currMatchIdx % 2 === 0;
            if (isTeam1) {
                nextMatch.team1 = currentMatch.winner;
            } else {
                nextMatch.team2 = currentMatch.winner;
            }

            if (nextMatch.winner) {
                const wId = nextMatch.winner.id;
                const t1Id = nextMatch.team1 ? nextMatch.team1.id : null;
                const t2Id = nextMatch.team2 ? nextMatch.team2.id : null;
                if (wId !== t1Id && wId !== t2Id) {
                    nextMatch.winner = null;
                }
            }

            currMatchIdx = nextMatchIdx;
        }
    };

    const exportBracket = async () => {
        setIsExporting(true);
        // Allow DOM to snap to large fixed dimensions for export
        setTimeout(async () => {
            try {
                const element = exportRef.current;
                const canvas = await html2canvas(element, {
                    backgroundColor: '#060913',
                    scale: 2,
                    useCORS: true,
                    logging: false
                });
                const link = document.createElement('a');
                link.download = '2026-Knockout-Predictor.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (error) {
                console.error("Failed to export bracket:", error);
            } finally {
                setIsExporting(false);
            }
        }, 400);
    };

    const TeamButton = ({ team, isPlaced }) => (
        <button
            onClick={() => placeTeamInBracket(team)}
            disabled={isPlaced}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-semibold transition-all w-full shadow-sm
                ${isPlaced
                    ? 'bg-black/40 border-gray-800 text-gray-600 opacity-40 cursor-not-allowed'
                    : 'bg-slate-800/80 border-slate-700 text-white hover:border-cup-accent hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] active:scale-95'
                }`}
        >
            <span className="text-2xl drop-shadow-md">{team.flag}</span>
            <span className="truncate">{team.name}</span>
            {isPlaced && <span className="ml-auto text-xs font-bold text-cup-win">✓</span>}
        </button>
    );

    const roundNames = ["ROUND OF 32", "ROUND OF 16", "QUARTER-FINALS", "SEMI-FINALS", "WORLD FINAL"];

    return (
        <div className="flex flex-col h-[100dvh] font-sans">

            {/* Header */}
            <header className="bg-cup-panel border-b border-white/5 p-3 md:p-5 shrink-0 flex justify-between items-center z-40 shadow-2xl relative">
                <div className="flex items-center gap-4">
                    <div className="h-8 md:h-10 w-1.5 bg-gradient-to-b from-cup-accent to-cup-pink hidden md:block rounded-full shadow-[0_0_10px_rgba(0,240,255,0.5)]"></div>
                    <div className="flex items-center flex-wrap gap-2 md:gap-4 mt-1">
                        <h1 className="text-2xl md:text-4xl title-font font-bold tracking-widest m-0 leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 drop-shadow-sm">2026 CHAMPIONSHIP</h1>
                        {/* INLINE TAG IMPLEMENTATION */}
                        <span className="text-cup-accent font-bold text-[9px] md:text-[11px] tracking-[0.2em] uppercase border border-cup-accent/40 bg-cup-accent/10 px-2 md:px-3 py-0.5 md:py-1 rounded-md">PREDICTIONS</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-6">
                    <button onClick={() => setRounds(generateInitialRounds())} className="text-[10px] md:text-sm font-bold text-gray-500 hover:text-white uppercase px-2 py-2 transition-colors tracking-widest">
                        Reset
                    </button>
                    <button onClick={exportBracket} className="bg-cup-pink text-white title-font text-lg md:text-2xl tracking-widest py-1 md:py-1.5 px-6 md:px-8 rounded hover:bg-opacity-80 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,85,0.3)] active:scale-95">
                        Share
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">

                {/* Mobile Drawer Overlay */}
                <div className={`
                    absolute inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden
                    ${isMobileDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `} onClick={() => setIsMobileDrawerOpen(false)}></div>

                {/* Sidebar / Mobile Drawer */}
                <div className={`
                    absolute bottom-0 left-0 right-0 h-[85dvh] bg-cup-panel z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col border-t border-white/5 transition-transform duration-300 ease-out
                    md:relative md:h-auto md:w-80 md:rounded-none md:border-r md:border-t-0 md:bg-black/40 md:z-20 md:shadow-none
                    ${isMobileDrawerOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
                    ${isExporting ? 'hidden' : ''}
                `}>
                    <div className="p-5 md:p-6 flex-1 overflow-y-auto hide-scroll">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="title-font text-2xl md:text-3xl text-cup-accent tracking-wider">Pending Teams</h2>
                            <button onClick={() => setIsMobileDrawerOpen(false)} className="md:hidden text-gray-400 p-2 text-xl font-bold bg-white/5 rounded-full w-10 h-10 flex items-center justify-center">✕</button>
                        </div>

                        <p className="text-[11px] text-cup-text mb-6 leading-relaxed">Tap a team to instantly slot them into the next available <span className="text-white font-bold border border-white/20 px-1 rounded">TBD</span> spot in the bracket.</p>

                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 border-b border-white/5 pb-2">Qualified (Unseeded)</h3>
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {window.dynamicTeams.filter(t => t.type === 'unseeded').map(team => (
                                <TeamButton key={team.id} team={team} isPlaced={placedIds.has(team.id)} />
                            ))}
                        </div>

                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 border-b border-white/5 pb-2">Final Group Matches</h3>
                        <div className="flex flex-col gap-4 pb-12 md:pb-0">
                            {window.groupMatches.map(match => {
                                const t1 = window.dynamicTeams.find(t => t.id === match.t1Id);
                                const t2 = window.dynamicTeams.find(t => t.id === match.t2Id);
                                return (
                                    <div key={match.id} className="bg-white/5 border border-white/10 rounded-xl p-3 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-cup-line"></div>
                                        <div className="text-[9px] text-cup-text text-center mb-2 font-bold tracking-[0.2em] uppercase">{match.group}</div>
                                        <div className="flex flex-col gap-2">
                                            <TeamButton team={t1} isPlaced={placedIds.has(t1.id)} />
                                            <div className="text-center text-[10px] text-gray-600 font-bold">VS</div>
                                            <TeamButton team={t2} isPlaced={placedIds.has(t2.id)} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* BRACKET AREA */}
                <div className={`flex-1 overflow-auto bg-glow-gradient bg-[length:100%_100%] bg-grid-pattern relative
                    ${isExporting ? 'overflow-visible bg-[#060913]' : ''}`}
                >
                    {/* Inner export wrapper fixes dimensions perfectly for html2canvas to prevent cutting off */}
                    <div
                        ref={exportRef}
                        className={`flex px-6 md:px-12 relative min-h-full
                            ${isExporting ? 'bg-[#060913] bg-glow-gradient bg-grid-pattern' : 'w-max pt-16 md:pt-24 pb-12'}
                        `}
                        style={isExporting ? {
                            width: '1800px',
                            height: '2450px',
                            paddingTop: '200px',
                            paddingLeft: '100px',
                            paddingRight: '100px',
                            gap: `${COLUMN_GAP}px`
                        } : { gap: `${COLUMN_GAP}px` }}
                    >
                        {/* Massive Watermark - Only visible in export */}
                        {isExporting && (
                            <div className="absolute top-12 left-24 z-0 flex items-center gap-6">
                                <div className="h-16 w-3 bg-gradient-to-b from-cup-accent to-cup-pink rounded-full"></div>
                                <h1 className="text-7xl title-font font-bold text-white tracking-widest drop-shadow-2xl m-0 flex items-center gap-8 mt-2">
                                    2026 CHAMPIONSHIP
                                    {/* INLINE TAG IMPLEMENTATION FOR EXPORT */}
                                    <span className="text-4xl text-cup-accent tracking-[0.2em] border-2 border-cup-accent/40 bg-cup-accent/10 px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                                        KNOCKOUT PREDICTIONS
                                    </span>
                                </h1>
                            </div>
                        )}

                        {Object.keys(rounds).map((roundKey) => {
                            const roundIndex = parseInt(roundKey);
                            const matches = rounds[roundKey];

                            // Math for perfectly centering each match wrapper
                            const slotHeight = BASE_SLOT_HEIGHT * Math.pow(2, roundIndex);

                            return (
                                <div key={`round-${roundIndex}`} className="flex flex-col relative shrink-0 z-10" style={{ width: `${BRACKET_WIDTH}px` }}>

                                    {/* Absolute Header so it doesn't disrupt the vertical math */}
                                    <h2 className={`absolute left-0 right-0 text-center title-font text-cup-text tracking-[0.3em] font-bold border-b-2 border-cup-line/50 pb-2
                                        ${isExporting ? '-top-16 text-3xl' : '-top-12 md:-top-16 text-xl md:text-2xl'}
                                    `}>
                                        {roundNames[roundIndex]}
                                    </h2>

                                    {matches.map((match, matchIndex) => {
                                        const isTeam1Winner = match.winner?.id === match.team1?.id;
                                        const isTeam2Winner = match.winner?.id === match.team2?.id;

                                        const renderTeamRow = (team, isTeam1) => {
                                            if (!team) {
                                                return (
                                                    <div className="tbd-slot flex items-center justify-center p-3 rounded-lg mt-1.5 border border-dashed border-white/20 text-white/30 text-[10px] font-bold tracking-[0.2em] h-[46px]">
                                                        AWAITING TEAM
                                                    </div>
                                                );
                                            }

                                            const isDynamic = team.id.startsWith('d');
                                            const isWinner = isTeam1 ? isTeam1Winner : isTeam2Winner;
                                            const isLoser = match.winner && !isWinner;

                                            return (
                                                <div
                                                    onClick={() => advanceTeam(roundIndex, matchIndex, team)}
                                                    className={`flex items-center justify-between px-3 py-2 rounded-lg mt-1.5 cursor-pointer transition-all border h-[46px] group relative
                                                        ${isWinner ? 'bg-cup-win/10 border-cup-win/80 text-white shadow-[0_0_15px_rgba(0,255,102,0.15)]' :
                                                          'bg-slate-900/60 border-transparent hover:bg-slate-800 active:scale-[0.98]'}
                                                        ${isLoser ? 'opacity-25 grayscale' : ''}`}
                                                >
                                                    {isWinner && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cup-win rounded-l-lg shadow-[0_0_8px_rgba(0,255,102,0.8)]"></div>}

                                                    <span className="flex items-center gap-3 truncate pl-1">
                                                        <span className="text-xl md:text-2xl drop-shadow-md">{team.flag}</span>
                                                        <span className={`font-bold text-sm md:text-base truncate ${isWinner ? 'text-cup-win' : 'text-gray-100'}`}>{team.name}</span>
                                                    </span>

                                                    {/* Remove Button for dynamically added teams in R32 */}
                                                    {roundIndex === 0 && isDynamic && !isExporting && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeTeamFromBracket(matchIndex, isTeam1); }}
                                                            className="text-gray-600 hover:text-cup-pink hover:bg-cup-pink/10 rounded-full w-7 h-7 flex items-center justify-center text-xs transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                                            title="Remove team"
                                                        >✕</button>
                                                    )}
                                                </div>
                                            );
                                        };

                                        return (
                                            // The Mathematical Wrapper ensures this match is centered in its allotted bracket space
                                            <div key={match.matchId} style={{ height: `${slotHeight}px` }} className="flex flex-col justify-center relative w-full">

                                                <div className="glass-panel match-card rounded-xl p-3 relative z-10 w-full shadow-xl">

                                                    {/* Perfect Bracket Connector Lines */}
                                                    {/* Right C-Bracket (Draws from Top Match to Bottom Match of a pair) */}
                                                    {matchIndex % 2 === 0 && roundIndex < 4 && (
                                                        <div className="absolute bracket-line pointer-events-none" style={{
                                                            top: '50%',
                                                            right: `-${COLUMN_GAP / 2}px`,
                                                            width: `${COLUMN_GAP / 2}px`,
                                                            height: `${slotHeight}px`,
                                                            borderTopWidth: '2px',
                                                            borderBottomWidth: '2px',
                                                            borderRightWidth: '2px',
                                                            borderTopRightRadius: '8px',
                                                            borderBottomRightRadius: '8px',
                                                            zIndex: -1
                                                        }}></div>
                                                    )}

                                                    {/* Left Incoming Line (Draws from Next Round Match leftwards to meet the C-Bracket) */}
                                                    {roundIndex > 0 && (
                                                        <div className="absolute bracket-line pointer-events-none" style={{
                                                            top: '50%',
                                                            left: `-${COLUMN_GAP / 2}px`,
                                                            width: `${COLUMN_GAP / 2}px`,
                                                            borderTopWidth: '2px',
                                                            zIndex: -1
                                                        }}></div>
                                                    )}

                                                    <div className="flex justify-between items-center text-[9px] md:text-[10px] text-cup-accent mb-2 font-bold tracking-widest uppercase px-1">
                                                        <span className="opacity-70">M{match.matchId.split('m')[1]}</span>
                                                        <span>{match.date}</span>
                                                    </div>
                                                    {renderTeamRow(match.team1, true)}
                                                    {renderTeamRow(match.team2, false)}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Mobile FAB to open Drawer */}
                {!isExporting && (
                    <button
                        onClick={() => setIsMobileDrawerOpen(true)}
                        className={`
                            md:hidden absolute bottom-6 right-6 left-6 bg-cup-accent text-black title-font text-2xl py-3 px-6 rounded-2xl shadow-[0_10px_30px_rgba(0,240,255,0.4)] z-30 transition-transform active:scale-95 border border-white/20
                            ${isMobileDrawerOpen ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}
                        `}
                    >
                        ✚ SELECT TEAMS
                    </button>
                )}
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
