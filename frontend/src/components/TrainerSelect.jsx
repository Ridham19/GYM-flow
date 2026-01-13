import { Check, User } from "lucide-react";

const TrainerSelect = ({ trainers, selectedId, onChange }) => {
    return (
        <div className="space-y-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Select Trainer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {trainers.map(trainer => {
                    const isSelected = selectedId === trainer._id;
                    return (
                        <div
                            key={trainer._id}
                            onClick={() => onChange(trainer._id)}
                            className={`
                                cursor-pointer rounded-xl p-3 border-2 transition-all flex items-center gap-3
                                ${isSelected
                                    ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]'
                                    : 'bg-secondary/30 border-transparent hover:bg-secondary/50'
                                }
                            `}
                        >
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center transition-colors
                                ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}
                            `}>
                                {isSelected ? <Check size={18} strokeWidth={3} /> : <User size={18} />}
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                    {trainer.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {trainer.specialization} ({trainer.workingHours?.start}-{trainer.workingHours?.end})
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            {!selectedId && (
                <p className="text-xs text-red-400 pl-1">* Please select a trainer</p>
            )}
        </div>
    );
};

export default TrainerSelect;
