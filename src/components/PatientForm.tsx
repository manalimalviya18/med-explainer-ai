import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Weight, Calendar, Languages } from "lucide-react";

export interface PatientData {
  age: string;
  weight: string;
  gender: string;
  language: string;
}

interface PatientFormProps {
  data: PatientData;
  onChange: (data: PatientData) => void;
}

export const PatientForm = ({ data, onChange }: PatientFormProps) => {
  const handleChange = (field: keyof PatientData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Patient Information (Optional)</h3>
          <p className="text-sm text-muted-foreground">
            Provide details for more personalized explanations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Age
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g., 3"
              value={data.age}
              onChange={(e) => handleChange('age', e.target.value)}
              min="0"
              max="150"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="flex items-center gap-2">
              <Weight className="w-4 h-4 text-primary" />
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="e.g., 11"
              value={data.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              min="0"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Gender
            </Label>
            <Select value={data.gender} onValueChange={(value) => handleChange('gender', value)}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-primary" />
              Preferred Language
            </Label>
            <Select value={data.language} onValueChange={(value) => handleChange('language', value)}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="spanish">Español (Spanish)</SelectItem>
                <SelectItem value="french">Français (French)</SelectItem>
                <SelectItem value="german">Deutsch (German)</SelectItem>
                <SelectItem value="chinese">中文 (Chinese)</SelectItem>
                <SelectItem value="arabic">العربية (Arabic)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};
