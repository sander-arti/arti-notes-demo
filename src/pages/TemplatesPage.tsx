import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  FileText,
  Check,
  Plus,
  Star,
  Search,
  X,
  Sparkles,
  GripVertical,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import { mockTemplates, templateCategories, Template } from '@/lib/mockTemplates';
import { motion, AnimatePresence } from 'framer-motion';

const availableIcons = ['📝', '📊', '📋', '💼', '🎯', '📌', '✅', '📁', '🗂️', '📑', '🏷️', '⭐'];

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

function TemplateCard({ template, isSelected, onSelect, onPreview }: TemplateCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "relative bg-white rounded-xl shadow-sm overflow-hidden transition-all cursor-pointer group",
        isSelected
          ? "ring-2 ring-violet-600 shadow-md"
          : "hover:shadow-md hover:ring-1 hover:ring-violet-200"
      )}
      onClick={onPreview}
    >
      {template.isDefault && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
            <Star className="h-3 w-3 mr-1" />
            Standard
          </span>
        </div>
      )}
      {template.isCustom && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <Sparkles className="h-3 w-3 mr-1" />
            Egendefinert
          </span>
        </div>
      )}

      <div className="p-5">
        <div className="text-3xl mb-3">{template.icon}</div>
        <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {template.sections.slice(0, 3).map((section, index) => (
            <span
              key={index}
              className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
            >
              {section}
            </span>
          ))}
          {template.sections.length > 3 && (
            <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
              +{template.sections.length - 3} mer
            </span>
          )}
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            isSelected
              ? "bg-violet-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-600"
          )}
        >
          {isSelected ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Valgt
            </>
          ) : (
            'Velg mal'
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          className="text-sm text-gray-500 hover:text-violet-600"
        >
          Forhåndsvis
        </button>
      </div>
    </motion.div>
  );
}

interface TemplatePreviewModalProps {
  template: Template | null;
  onClose: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

function TemplatePreviewModal({ template, onClose, onSelect, isSelected }: TemplatePreviewModalProps) {
  if (!template) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{template.icon}</div>
                <div>
                  <h2 className="text-xl font-bold">{template.name}</h2>
                  <p className="text-gray-600">{template.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[50vh]">
            <h3 className="font-semibold mb-4">Seksjoner i denne malen:</h3>
            <div className="space-y-2">
              {template.sections.map((section, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="flex items-center justify-center w-6 h-6 bg-violet-100 text-violet-600 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <span>{section}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="button-secondary"
            >
              Lukk
            </button>
            <button
              onClick={onSelect}
              className={cn(
                "button-primary inline-flex items-center",
                isSelected && "bg-green-600 hover:bg-green-700"
              )}
            >
              {isSelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Mal er valgt
                </>
              ) : (
                'Velg denne malen'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface CreateTemplateModalProps {
  onClose: () => void;
  onCreate: (template: Template) => void;
}

function CreateTemplateModal({ onClose, onCreate }: CreateTemplateModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Template['category']>('standard');
  const [icon, setIcon] = useState('📝');
  const [sections, setSections] = useState<string[]>(['Deltakere', 'Agenda', 'Diskusjon']);
  const [newSection, setNewSection] = useState('');

  const handleAddSection = () => {
    if (newSection.trim()) {
      setSections([...sections, newSection.trim()]);
      setNewSection('');
    }
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Vennligst skriv inn et navn for malen');
      return;
    }
    if (sections.length === 0) {
      toast.error('Legg til minst én seksjon');
      return;
    }

    const newTemplate: Template = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Egendefinert mal',
      category,
      sections,
      icon,
      isCustom: true
    };

    onCreate(newTemplate);
    toast.success('Mal opprettet!');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-violet-100 rounded-xl">
                  <FileText className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Opprett egen mal</h2>
                  <p className="text-sm text-gray-600">Lag en mal tilpasset dine behov</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh] space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mal-navn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="F.eks. Ukentlig statusmøte"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beskrivelse
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="En kort beskrivelse av hva malen brukes til..."
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Template['category'])}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
              >
                <option value="standard">Standard</option>
                <option value="formal">Formell</option>
                <option value="agile">Agile</option>
                <option value="sales">Salg</option>
                <option value="hr">HR</option>
              </select>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ikon
              </label>
              <div className="flex flex-wrap gap-2">
                {availableIcons.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    className={cn(
                      "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                      icon === emoji
                        ? "bg-violet-100 ring-2 ring-violet-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seksjoner
              </label>
              <div className="space-y-2 mb-3">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg group"
                  >
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <span className="flex-1 text-sm">{section}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(index)}
                      className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSection();
                    }
                  }}
                  placeholder="Legg til seksjon..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-violet-500 focus:ring-violet-500"
                />
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="button-secondary"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="button-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Opprett mal
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('template-1');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);

  // Combine mock templates with custom templates
  const allTemplates = [...mockTemplates, ...customTemplates];

  const filteredTemplates = allTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast.success('Mal valgt! Den vil brukes som standard for nye opptak.');
  };

  const handleCreateTemplate = (template: Template) => {
    setCustomTemplates([...customTemplates, template]);
  };

  const selectedTemplateName = allTemplates.find(t => t.id === selectedTemplate)?.name;

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Tilbake til dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <FileText className="h-6 w-6 text-violet-600" />
                </div>
                <h1 className="text-3xl font-bold">Maler for møtereferat</h1>
              </div>
              <p className="text-gray-600">
                Velg en mal som passer til dine møter. Malen brukes når du eksporterer eller redigerer sammendrag.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="button-secondary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Opprett egen mal
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Søk etter maler..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
              {templateCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    selectedCategory === category.id
                      ? "bg-violet-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Template Info */}
        {selectedTemplate && selectedTemplateName && (
          <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-100 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-violet-600" />
                <span className="text-violet-900">
                  <strong>{selectedTemplateName}</strong> er din aktive mal
                </span>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-sm text-violet-600 hover:text-violet-700"
              >
                Fjern valg
              </button>
            </div>
          </div>
        )}

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={() => handleSelectTemplate(template.id)}
                onPreview={() => setPreviewTemplate(template)}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen maler funnet</h3>
            <p className="text-gray-600">Prøv et annet søkeord eller kategori</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => {
            handleSelectTemplate(previewTemplate.id);
            setPreviewTemplate(null);
          }}
          isSelected={selectedTemplate === previewTemplate.id}
        />
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <CreateTemplateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTemplate}
        />
      )}
    </main>
  );
}
