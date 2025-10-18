import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  FileText, 
  DollarSign,
  AlertCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            {t('help.title')}
          </DialogTitle>
          <DialogDescription>
            {t('dashboard.subtitle')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Getting Started */}
            <section>
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                {t('help.gettingStarted')}
              </h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      1
                    </div>
                    <div>
                      <h4 className="text-slate-900 mb-1">{t('help.step1')}</h4>
                      <p className="text-sm text-slate-600">
                        {t('help.step1desc')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      2
                    </div>
                    <div>
                      <h4 className="text-slate-900 mb-1">{t('help.step2')}</h4>
                      <p className="text-sm text-slate-600">
                        {t('help.step2desc')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      3
                    </div>
                    <div>
                      <h4 className="text-slate-900 mb-1">{t('help.step3')}</h4>
                      <p className="text-sm text-slate-600">
                        {t('help.step3desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Key Features */}
            <section>
              <h3 className="text-slate-900 mb-4">{t('help.features')}</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-slate-900 mb-1">{t('help.feature1')}</h4>
                    <p className="text-sm text-slate-600">
                      {t('help.feature1desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-slate-900 mb-1">{t('help.feature2')}</h4>
                    <p className="text-sm text-slate-600">
                      {t('help.feature2desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-slate-900 mb-1">{t('help.feature3')}</h4>
                    <p className="text-sm text-slate-600">
                      {t('help.feature3desc')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Map Marker Colors */}
            <section>
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {t('help.markerColors')}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0"></div>
                  <span className="text-sm text-slate-700">{t('help.red')}</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 flex-shrink-0"></div>
                  <span className="text-sm text-slate-700">{t('help.yellow')}</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <span className="text-sm text-slate-700">{t('help.blue')}</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0"></div>
                  <span className="text-sm text-slate-700">{t('help.green')}</span>
                </div>
              </div>
            </section>

            {/* Status Badges Reference */}
            <section>
              <h4 className="text-slate-900 mb-3">Report Status</h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  {t('stats.pending')}
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  {t('stats.inProgress')}
                </Badge>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {t('stats.resolved')}
                </Badge>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
