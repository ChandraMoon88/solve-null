'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { BookOpen, X, Save, Trash2, Calendar, Eye } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface JournalEntry {
  id: string
  levelId: number
  levelName: string
  content: string
  timestamp: string
  insights: string[]
}

export default function ConsciousnessJournal() {
  const [isOpen, setIsOpen] = useState(false)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState('')
  const [currentLevelId, setCurrentLevelId] = useState(1)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const saved = localStorage.getItem('consciousness_journal')
    if (saved) {
      setEntries(JSON.parse(saved))
    }
  }, [])

  const getLevelNames = () => [
    t.levelData.level0.title,
    t.levelData.level1.title,
    t.levelData.level2.title,
    t.levelData.level3.title,
    t.levelData.level4.title,
    t.levelData.level5.title,
    t.levelData.level6.title,
    t.levelData.level7.title,
    t.levelData.level8.title,
    t.levelData.level9.title,
    t.levelData.level10.title,
  ]

  const saveEntry = () => {
    if (!currentEntry.trim()) return

    const levelNames = getLevelNames()

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      levelId: currentLevelId,
      levelName: levelNames[currentLevelId] || `Level ${currentLevelId}`,
      content: currentEntry,
      timestamp: new Date().toISOString(),
      insights: extractInsights(currentEntry),
    }

    const updated = [newEntry, ...entries]
    setEntries(updated)
    localStorage.setItem('consciousness_journal', JSON.stringify(updated))
    setCurrentEntry('')
  }

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem('consciousness_journal', JSON.stringify(updated))
    setSelectedEntry(null)
  }

  const extractInsights = (text: string): string[] => {
    const insights: string[] = []
    const keywords = [
      'realized', 'understood', 'discovered', 'learned',
      'consciousness', 'awareness', 'truth', 'challenge',
      'choice', 'decision', 'perspective', 'meaning'
    ]
    
    keywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        insights.push(keyword)
      }
    })
    
    return insights.slice(0, 5)
  }

  return (
    <>
      {/* Floating Journal Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-consciousness-500 to-purple-600 shadow-lg hover:shadow-consciousness-500/50 flex items-center justify-center transition-all"
      >
        <BookOpen className="w-6 h-6 text-white" />
      </motion.button>

      {/* Journal Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => {
              setIsOpen(false)
              setSelectedEntry(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass border border-void-500/40 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="border-b border-void-500/30 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-1">
                    Consciousness Journal
                  </h2>
                  <p className="text-void-400 text-sm font-mono">
                    Document your journey through the levels
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    setSelectedEntry(null)
                  }}
                  className="p-2 rounded-lg hover:bg-void-900/50 transition-colors"
                >
                  <X className="w-6 h-6 text-void-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {!selectedEntry ? (
                  <div className="space-y-6">
                    {/* New Entry Form */}
                    <div className="glass border border-consciousness-500/20 rounded-xl p-6">
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-consciousness-400" />
                        {t.journal.newReflection}
                      </h3>
                      
                      <div className="mb-4">
                        <label className="text-void-400 text-sm font-mono mb-2 block">
                          {t.journal.level}
                        </label>
                        <select
                          value={currentLevelId}
                          onChange={(e) => setCurrentLevelId(parseInt(e.target.value))}
                          className="w-full px-4 py-2 rounded-lg bg-void-900/50 border border-void-500/40 text-white focus:outline-none focus:ring-2 focus:ring-consciousness-500/50"
                        >
                          <option value={0}>{t.levelData.level0.title}</option>
                          <option value={1}>{t.journal.level} 1: {t.levelData.level1.title}</option>
                          <option value={2}>{t.journal.level} 2: {t.levelData.level2.title}</option>
                          <option value={3}>{t.journal.level} 3: {t.levelData.level3.title}</option>
                          <option value={4}>{t.journal.level} 4: {t.levelData.level4.title}</option>
                          <option value={5}>{t.journal.level} 5: {t.levelData.level5.title}</option>
                          <option value={6}>{t.journal.level} 6: {t.levelData.level6.title}</option>
                          <option value={7}>{t.journal.level} 7: {t.levelData.level7.title}</option>
                          <option value={8}>{t.journal.level} 8: {t.levelData.level8.title}</option>
                          <option value={9}>{t.journal.level} 9: {t.levelData.level9.title}</option>
                          <option value={10}>{t.journal.level} 10: {t.levelData.level10.title}</option>
                        </select>
                      </div>

                      <textarea
                        value={currentEntry}
                        onChange={(e) => setCurrentEntry(e.target.value)}
                        placeholder={t.journal.whatDiscovered}
                        className="w-full px-4 py-3 rounded-lg bg-void-900/50 border border-void-500/40 text-white placeholder-void-600 focus:outline-none focus:ring-2 focus:ring-consciousness-500/50 resize-none"
                        rows={6}
                      />

                      <button
                        onClick={saveEntry}
                        disabled={!currentEntry.trim()}
                        className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-consciousness-500 to-purple-600 text-white font-semibold hover:from-consciousness-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {t.journal.saveReflection}
                      </button>
                    </div>

                    {/* Past Entries */}
                    <div>
                      <h3 className="text-void-400 font-mono text-sm mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {t.journal.pastReflections} ({entries.length})
                      </h3>
                      
                      {entries.length === 0 ? (
                        <div className="text-center py-12 text-void-500 font-mono text-sm">
                          {t.journal.noEntries}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {entries.map((entry) => (
                            <motion.div
                              key={entry.id}
                              whileHover={{ scale: 1.01, x: 5 }}
                              className="glass border border-void-500/30 rounded-lg p-4 cursor-pointer hover:border-consciousness-500/40 transition-all"
                              onClick={() => setSelectedEntry(entry)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="text-white font-semibold mb-1">
                                    {entry.levelName}
                                  </h4>
                                  <p className="text-void-400 text-xs font-mono">
                                    {new Date(entry.timestamp).toLocaleDateString()} {t.journal.at}{' '}
                                    {new Date(entry.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                                <Eye className="w-4 h-4 text-void-500" />
                              </div>
                              <p className="text-void-300 text-sm line-clamp-2">
                                {entry.content}
                              </p>
                              {entry.insights.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {entry.insights.map((insight, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-1 rounded bg-consciousness-500/10 text-consciousness-400 font-mono"
                                    >
                                      {insight}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // View Entry Detail
                  <div>
                    <button
                      onClick={() => setSelectedEntry(null)}
                      className="text-void-400 hover:text-void-300 mb-4 flex items-center gap-2 font-mono text-sm"
                    >
                      {t.journal.backToAll}
                    </button>

                    <div className="glass border border-consciousness-500/30 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-display font-bold text-white mb-2">
                            {selectedEntry.levelName}
                          </h3>
                          <p className="text-void-400 text-sm font-mono">
                            {new Date(selectedEntry.timestamp).toLocaleDateString()} {t.journal.at}{' '}
                            {new Date(selectedEntry.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteEntry(selectedEntry.id)}
                          className="p-2 rounded-lg hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {selectedEntry.insights.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {selectedEntry.insights.map((insight, idx) => (
                            <span
                              key={idx}
                              className="text-sm px-3 py-1 rounded-lg bg-consciousness-500/20 text-consciousness-300 font-mono border border-consciousness-500/30"
                            >
                              {insight}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-void-200 leading-relaxed whitespace-pre-wrap">
                        {selectedEntry.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
